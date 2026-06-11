import urllib.request
import re
import json

url = "https://www.booking.com/hotel/np/peace-and-joy-guest-house.html"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
    
    # Write raw HTML to debug file first
    with open("scratch/booking_page.html", "w", encoding="utf-8") as f:
        f.write(html)
        
    print(f"HTML downloaded. Length: {len(html)}")
    
    # Try finding image filenames (e.g., /553043545.jpg or 316359039.jpg)
    img_ids = re.findall(r'(\d{8,10})\.jpg', html)
    unique_ids = list(set(img_ids))
    print(f"Found {len(unique_ids)} image IDs:")
    print(unique_ids)
    
except Exception as e:
    print(f"Error: {e}")
