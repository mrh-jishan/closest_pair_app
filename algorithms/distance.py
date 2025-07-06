import math

def calculate_distance(p1, p2):
    # √((x₁ - x₂)² + (y₁ - y₂)²)
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)