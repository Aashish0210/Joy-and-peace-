import urllib.request
import os

url = "https://cf.bstatic.com/xdata/images/hotel/max1024x768/316359039.jpg?k=9acf4b1c2e8493e3070a2912b7171acc90edbc68d3b0a6b0397ad39ef6ffd064&o=&hp=1"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'}

output_path = os.path.join("assets", "building_facade.png")
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        with open(output_path, 'wb') as out_file:
            out_file.write(response.read())
    print("Successfully downloaded building facade!")
except Exception as e:
    print(f"Error: {e}")
