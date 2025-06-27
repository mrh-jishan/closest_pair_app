import unittest
import random
from tabulate import tabulate
from algorithms.brute_force import brute_force_closest_pair
from algorithms.divide_conquer import divide_and_conquer_closest_pair

def generate_points(n, seed=42):
    random.seed(seed)
    return [(random.uniform(0, 1000), random.uniform(0, 1000)) for _ in range(n)]

class TestClosestPairAlgorithms(unittest.TestCase):
    def setUp(self):
        self.test_cases = [
            (10, 'Small'),
            (100, 'Medium'),
            (1000, 'Large'),
            (5000, 'XLarge'),
        ]
        self.results = []

    def test_algorithms(self):
        for n, label in self.test_cases:
            points = generate_points(n)
            pair_bf, dist_bf = brute_force_closest_pair(points)
            pair_dc, dist_dc = divide_and_conquer_closest_pair(points)
            self.results.append([
                label, n, dist_bf, dist_dc, pair_bf, pair_dc
            ])
        headers = ['Case', 'n', 'BruteForce Dist', 'Divide&Conquer Dist', 'BruteForce Pair', 'Divide&Conquer Pair']
        print(tabulate(self.results, headers=headers, tablefmt='github'))

if __name__ == '__main__':
    unittest.main()
