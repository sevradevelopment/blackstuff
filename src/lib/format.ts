export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("et-EE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
