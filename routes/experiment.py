from flask import Blueprint, request, jsonify
from algorithms.brute_force import brute_force_closest_pair
from algorithms.divide_conquer import divide_and_conquer_closest_pair
from utils.generator import generate_distinct_points
import time
import math

experiment_bp = Blueprint('experiment', __name__)

@experiment_bp.route('/run-experiment', methods=['POST'])
def run_experiment():
    data = request.get_json()
    current_n = data['n']
    all_n_values = sorted(set(data.get('all_n', []) + [current_n]))
    m = 10
    results = {}
    ratios_alg1, ratios_alg2 = [], []
    points_for_viz = []

    for n in all_n_values:
        times1, times2 = [], []
        for i in range(m):
            points = generate_distinct_points(n)
            if n == current_n and i == 0:
                points_for_viz = points

            start = time.perf_counter()
            pair1, dist1 = brute_force_closest_pair(points)
            times1.append((time.perf_counter() - start) * 1000)

            start = time.perf_counter()
            pair2, dist2 = divide_and_conquer_closest_pair(points)
            times2.append((time.perf_counter() - start) * 1000)

        avg1 = sum(times1) / m
        avg2 = sum(times2) / m
        t1 = n**2
        t2 = n * math.log2(n)
        r1 = avg1 / t1 if t1 else 0
        r2 = avg2 / t2 if t2 else 0
        ratios_alg1.append(r1)
        ratios_alg2.append(r2)
        results[n] = {
            "n": n,
            "empirical_rt_alg1": avg1,
            "empirical_rt_alg2": avg2,
            "theoretical_rt_alg1": t1,
            "theoretical_rt_alg2": t2,
            "ratio_alg1": r1,
            "ratio_alg2": r2,
            "closest_pair_alg1": pair1
        }

    c1 = max(ratios_alg1)
    c2 = max(ratios_alg2)
    for n in results:
        results[n]['predicted_rt_alg1'] = c1 * results[n]['theoretical_rt_alg1']
        results[n]['predicted_rt_alg2'] = c2 * results[n]['theoretical_rt_alg2']

    return jsonify({"points": points_for_viz, "results": results})
