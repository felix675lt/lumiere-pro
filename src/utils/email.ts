import emailjs from '@emailjs/browser';

export const sendAdminNotification = async (title: string, payload: Record<string, any>) => {
    // @ts-ignore
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    // @ts-ignore
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    // @ts-ignore
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
        console.warn("EmailJS credentials are not configured in environment variables.");
        return;
    }

    // Format the payload into a clean, readable text block for the email body.
    const messageBody = `
[알림] 새로운 접수 내역이 도착했습니다.
유형: ${title}
--------------------------------------------------
${Object.entries(payload)
            .map(([key, value]) => `[${key}]: ${value || '입력 없음'}`)
            .join('\n')}
--------------------------------------------------
`.trim();

    try {
        await emailjs.send(
            serviceId,
            templateId,
            { message: messageBody }, // the {{message}} variable in the template
            publicKey
        );
        console.log("EmailJS: Admin notification sent successfully.");
    } catch (error) {
        console.error("EmailJS: Failed to send admin notification:", error);
    }
};
