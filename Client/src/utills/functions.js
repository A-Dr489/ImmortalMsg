export function setTime(time) {
    const date = new Date(time);

    const formatted = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return formatted;
}