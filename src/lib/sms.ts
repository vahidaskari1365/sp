/**
 * Order SMS notifications.
 * Set KAVENEGAR_API_KEY + KAVENEGAR_SENDER in the environment to send real SMS.
 * Without credentials the notification is simulated (logged) so the flow stays testable.
 */
export async function sendOrderSms(phone: string, message: string): Promise<string> {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  const sender = process.env.KAVENEGAR_SENDER;

  if (!apiKey || !sender) {
    console.info(`[sms:simulated] to=${phone} :: ${message}`);
    return "simulated";
  }

  try {
    const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json?receptor=${encodeURIComponent(
      phone,
    )}&sender=${encodeURIComponent(sender)}&message=${encodeURIComponent(message)}`;
    const response = await fetch(url, { method: "GET", cache: "no-store" });
    if (!response.ok) return "failed";
    return "sent";
  } catch (error) {
    console.error("sms send failed", error);
    return "failed";
  }
}
