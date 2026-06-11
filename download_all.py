import urllib.request
import os

images = {
    "hero_background.png": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/552648659.jpg?k=b35ece6815eb411e8607d94bb3617a5b31ee30afac51a7b4390086e84440473e&o=&hp=1",
    "deluxe_room.png": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/553043545.jpg?k=e080216085afd83e659dbbfcf75dd98beb300e22392f1124278a46765e4e520e",
    "twin_room.png": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/553053255.jpg?k=3fa342388a7e439a9643047347db5913b5232e8117e5e60bfbaa9951b7eac28a",
    "rooftop_terrace.png": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/553044012.jpg?k=a7cde219be9cf32ef3e7e506df55beaa58be11a916379ff033d489ea788a5294&o=&hp=1",
    "breakfast_spread.png": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/553041851.jpg?k=99ac3a1001254e6828b5acd0bcc949e17aaf0c4f397f90a975bda44dd16bb718",
    "paton_square.png": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/211026811.jpg?k=bdd0a126b978b08fe3f58f11f23f0cc2bbb489f2ced98cb5bb9ecb76f05ef82a&o=&hp=1"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'}

os.makedirs("assets", exist_ok=True)

for name, url in images.items():
    output_path = os.path.join("assets", name)
    print(f"Downloading {name} from {url}...")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            with open(output_path, 'wb') as out_file:
                out_file.write(response.read())
        print(f"Successfully downloaded {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")

print("All downloads finished!")
