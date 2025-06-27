from .distance import calculate_distance

def brute_force_closest_pair(points):
    min_dist = float('inf')
    closest = (None, None)
    for i in range(len(points)):
        for j in range(i + 1, len(points)):
            d = calculate_distance(points[i], points[j])
            if d < min_dist:
                min_dist = d
                closest = (points[i], points[j])
    return closest, min_dist