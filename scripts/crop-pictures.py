"""Crop the book's pictures. Coordinates are on the 100-dpi page renders (827x1063);
pages are rendered at 200 dpi, so every number is doubled. Solved-book pages (s-NN) use
110-dpi coordinates on 220-dpi renders."""
import sys, os
from PIL import Image
HI = sys.argv[1]; OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)
CROPS = {
  # Lesson 1 — where living things live
  'camel-desert': (83, 82, 212, 355, 366),
  'line-octopus': (83, 110, 562, 214, 640), 'line-fish': (83, 260, 572, 374, 638), 'line-lizard': (83, 408, 572, 555, 645),
  'line-palm': (83, 126, 642, 220, 730), 'line-camel': (83, 266, 645, 370, 733), 'line-coral': (83, 423, 645, 532, 733),
  'desert': (83, 88, 740, 313, 889), 'sea': (83, 322, 740, 548, 889),
  'forest': (84, 107, 142, 515, 341), 'desert-life': (84, 250, 360, 699, 559), 'polar-life': (84, 85, 580, 538, 779), 'savanna': (84, 250, 803, 699, 1005),
  'pond': (85, 129, 74, 709, 455), 'reef': (85, 130, 590, 709, 970),
  'fish': (86, 74, 345, 207, 455), 'squirrel': (86, 74, 481, 207, 593), 'bird': (86, 74, 618, 207, 730), 'rabbit': (86, 74, 754, 207, 866),
  'nest': (86, 392, 345, 528, 455), 'burrow': (86, 392, 481, 528, 593), 'coral-home': (86, 392, 618, 528, 730), 'tree-hole': (86, 392, 754, 528, 866),
  'sea-rocks': (87, 117, 82, 495, 283), 'rabbit-burrow': (87, 139, 299, 350, 508), 'bird-nest': (87, 462, 300, 738, 484),
  'fennec-burrow': (87, 108, 688, 388, 878), 'squirrel-tree': (87, 458, 697, 758, 982),
  'lost-home': (88, 138, 93, 400, 267), 'migrating-birds': (88, 93, 388, 319, 558), 'bear-cave': (88, 486, 544, 661, 716),
  'sand-burrow': (89, 120, 470, 530, 640), 'sea-mistake': (89, 198, 734, 629, 977),
  'pine': (98, 198, 486, 252, 553), 'seaweed': (98, 332, 483, 388, 553), 'tree': (98, 467, 493, 542, 553), 'cactus': (98, 602, 488, 662, 553),
  'dolphin': (98, 138, 632, 277, 687), 'zebra': (98, 322, 613, 402, 687), 'whale': (98, 458, 642, 552, 682), 'shark': (98, 588, 622, 682, 687),
  'harm-plant': (98, 191, 754, 263, 826), 'harm-fish': (98, 327, 754, 399, 826), 'harm-river': (98, 481, 764, 543, 826), 'cough-small': (98, 606, 764, 668, 826),
  'bike-small': (98, 196, 899, 261, 966), 'burning-small': (98, 336, 899, 401, 966), 'garbage-small': (98, 479, 899, 543, 966), 'cutting-small': (98, 604, 899, 671, 966),
  'polar-scene': (99, 119, 99, 427, 361), 'harm-scene': (99, 118, 418, 427, 661), 'dead-fish': (99, 128, 728, 417, 962),
  # Lesson 2 — protecting where they live
  'two-worlds': (90, 69, 208, 317, 379), 'dirty-beach': (90, 106, 549, 293, 651), 'clean-beach': (90, 311, 549, 499, 651),
  'smoke-land': (90, 82, 782, 210, 862), 'garden': (90, 235, 782, 363, 862), 'fish-shore': (90, 388, 782, 516, 862),
  'factory-scene': (91, 86, 84, 753, 305), 'water-trash': (91, 421, 323, 759, 512), 'factory-smoke': (91, 81, 484, 417, 671),
  'tree-cutting': (91, 421, 643, 759, 832), 'park-litter': (91, 81, 786, 417, 1009),
  'coughing': (92, 152, 217, 388, 413), 'oiled-bird': (92, 417, 462, 653, 678), 'dead-trees': (92, 157, 702, 433, 918),
  'bin-food': (93, 100, 363, 197, 435), 'bin-plastic': (93, 254, 363, 351, 435), 'bin-paper': (93, 407, 363, 499, 435),
  'boy-bin-art': (93, 352, 610, 436, 695), 'factory-art': (93, 162, 612, 274, 694), 'bike-art': (93, 170, 700, 249, 792), 'cars-art': (93, 321, 710, 439, 784),
  'boy-bin': (94, 504, 169, 709, 374), 'recycle-bins': (94, 68, 256, 345, 466), 'cyclists': (94, 374, 406, 610, 640),
  'cloth-bag': (94, 69, 624, 281, 941), 'farmer': (94, 536, 659, 747, 979),
  'dead-plants': (95, 106, 113, 409, 307), 'turtle-plastic': (95, 92, 376, 322, 548), 'fruit-peel': (95, 453, 593, 562, 722), 'plastic-bottle': (95, 588, 598, 720, 722),
  'burning-trash': (96, 78, 406, 407, 600), 'clean-desert': (96, 191, 737, 624, 979),
  # From the solved book (pictures only, never its red marks)
  'food-waste': ('s-40', 63, 452, 206, 596), 'plastic-waste': ('s-40', 240, 453, 466, 591), 'paper-waste': ('s-40', 496, 446, 646, 592),
  'litter-desert': ('s-42', 166, 868, 734, 1170),
}
MAX = 640
for name, (page, x0, y0, x1, y1) in CROPS.items():
    if isinstance(page, str):
        src = os.path.join(HI, f'{page}.png'); k = 2
    else:
        src = os.path.join(HI, f'p-{page:03d}.png'); k = 2
    im = Image.open(src).convert('RGB')
    box = (x0 * k, y0 * k, x1 * k, y1 * k)
    c = im.crop(box)
    if max(c.size) > MAX:
        c.thumbnail((MAX, MAX), Image.LANCZOS)
    c.save(os.path.join(OUT, f'{name}.jpg'), quality=84, optimize=True, progressive=True)
print(len(CROPS), 'pictures')
