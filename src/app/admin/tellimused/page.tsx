import { OrdersAdmin } from "@/components/admin/OrdersAdmin";
import { getOrders } from "@/lib/db";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrdersAdmin orders={orders} />;
}
