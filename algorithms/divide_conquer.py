from .brute_force import brute_force_closest_pair
from .merge_sort import merge_sort
from .distance import calculate_distance
import math

def divide_and_conquer_closest_pair(points):
    if len(points) < 2:
        return None, float('inf')
    px = merge_sort(points, 0)
    py = merge_sort(points, 1)
    return _dac_recursive(px, py)

def _dac_recursive(px, py):
    if len(px) <= 3:
        return brute_force_closest_pair(px)
    mid = len(px) // 2
    midpoint = px[mid]
    qx = px[:mid]
    rx = px[mid:]
    qy = [p for p in py if p[0] <= midpoint[0]]
    ry = [p for p in py if p[0] > midpoint[0]]

    (p1, d1) = _dac_recursive(qx, qy)
    (p2, d2) = _dac_recursive(rx, ry)
    d = min(d1, d2)
    closest = p1 if d == d1 else p2

    strip = [p for p in py if abs(p[0] - midpoint[0]) < d]
    for i in range(len(strip)):
        for j in range(i + 1, min(i + 8, len(strip))):
            d_strip = calculate_distance(strip[i], strip[j])
            if d_strip < d:
                d = d_strip
                closest = (strip[i], strip[j])
    return closest, d