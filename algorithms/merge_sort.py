def merge_sort(points, key_index):
    if len(points) <= 1:
        return points
    mid = len(points) // 2
    left = merge_sort(points[:mid], key_index)
    right = merge_sort(points[mid:], key_index)
    return _merge(left, right, key_index)

def _merge(left, right, key_index):
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i][key_index] <= right[j][key_index]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    return merged + left[i:] + right[j:]
