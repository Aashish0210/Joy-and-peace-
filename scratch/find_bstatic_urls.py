import urllib.request
import re
import os

url = "https://www.booking.com/hotel/np/peace-and-joy-guest-house.html"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
    
    print(f"HTML Length: {len(html)}")
    print(f"HTML Snippet:\n{html[:1000]}")
    
    # Let's find anything containing bstatic.com
    urls = re.findall(r'https://[a-zA-Z0-9.-]*bstatic\.com/[^\s"\'()<>]+', html)
    unique_urls = list(set(urls))
    print(f"Found {len(unique_urls)} bstatic URLs:")
    
    for u in sorted(unique_urls):
        # clean url from escaping (like \/)
        clean_url = u.replace('\\/', '/')
        if 'images/hotel' in clean_url:
            print(clean_url)
            
except Exception as e:
    print(f"Error: {e}")
