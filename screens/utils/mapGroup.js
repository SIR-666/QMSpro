export function mapGroup(id) {
  const mapping = {
    1: "BROMO",
    2: "SEMERU",
    3: "KRAKATAU",
  };

  return mapping[id] || id;
}
