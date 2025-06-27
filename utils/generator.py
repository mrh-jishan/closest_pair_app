import random

def generate_distinct_points(n, max_coord=32767):
    points = set()
    while len(points) < n:
        points.add((random.randint(0, max_coord), random.randint(0, max_coord)))
    return list(points)