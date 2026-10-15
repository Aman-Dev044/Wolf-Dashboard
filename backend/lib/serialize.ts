/* Converts lean Mongo documents into plain JSON-friendly objects with `id` instead of `_id`. */
export function serialize<T extends Record<string, unknown>>(doc: T): Omit<T, "_id" | "__v"> & { id: string } {
  const { _id, __v, ...rest } = doc as Record<string, unknown>;
  void __v;
  return JSON.parse(JSON.stringify({ id: String(_id), ...rest }));
}

export function serializeProduct(doc: Record<string, unknown>) {
  const p = serialize(doc) as Record<string, unknown> & { variations?: Array<Record<string, unknown>> };
  if (p.variations) {
    p.variations = p.variations.map((v) => {
      const { _id, ...rest } = v;
      return { id: String(_id), ...rest };
    });
  }
  return p;
}
