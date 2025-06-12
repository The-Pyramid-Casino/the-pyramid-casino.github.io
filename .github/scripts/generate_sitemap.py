import os
import subprocess
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from datetime import datetime

BASE_URL = "https://arthurb26.github.io/"
OUTPUT_FILE = "sitemap.xml"
SITE_DIR = "."

# You can customize changefreq and priority logic here
DEFAULT_CHANGEFREQ = "monthly"
DEFAULT_PRIORITY = "0.5"

def find_html_files(root_dir):
    html_files = []
    for subdir, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                full_path = os.path.join(subdir, file)
                # Ignore files in .github and hidden directories
                if '.github' in full_path or '/.' in full_path:
                    continue
                html_files.append(full_path)
    return html_files

def url_for_file(file_path):
    rel_path = os.path.relpath(file_path, SITE_DIR)
    url_path = rel_path.replace(os.sep, '/')
    if url_path.endswith('index.html'):
        url_path = url_path[:-10]  # Remove 'index.html'
    return urljoin(BASE_URL, url_path)

def get_lastmod(file_path):
    try:
        # Get last commit date for the file in ISO format
        result = subprocess.run(
            ["git", "log", "-1", "--format=%cI", "--", file_path],
            capture_output=True, text=True, check=True
        )
        lastmod = result.stdout.strip()
        if lastmod:
            return lastmod
    except Exception:
        pass
    # Fallback: filesystem mtime
    try:
        mtime = os.path.getmtime(file_path)
        return datetime.utcfromtimestamp(mtime).strftime("%Y-%m-%dT%H:%M:%SZ")
    except Exception:
        return None

def main():
    html_files = find_html_files(SITE_DIR)
    seen_urls = set()
    url_entries = []

    # Add URLs for each HTML file
    for file in html_files:
        url = url_for_file(file)
        if url not in seen_urls:
            seen_urls.add(url)
            lastmod = get_lastmod(file)
            url_entries.append({
                "loc": url,
                "lastmod": lastmod,
                "changefreq": DEFAULT_CHANGEFREQ,
                "priority": DEFAULT_PRIORITY,
            })

    # Always include the base URL (index)
    url_entries.append({
        "loc": BASE_URL,
        "lastmod": get_lastmod("index.html"),
        "changefreq": "weekly",
        "priority": "1.0",
    })

    # Write sitemap.xml
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for entry in url_entries:
            f.write('  <url>\n')
            f.write(f'    <loc>{entry["loc"]}</loc>\n')
            if entry["lastmod"]:
                f.write(f'    <lastmod>{entry["lastmod"]}</lastmod>\n')
            if entry["changefreq"]:
                f.write(f'    <changefreq>{entry["changefreq"]}</changefreq>\n')
            if entry["priority"]:
                f.write(f'    <priority>{entry["priority"]}</priority>\n')
            f.write('  </url>\n')
        f.write('</urlset>\n')

if __name__ == "__main__":
    main()
