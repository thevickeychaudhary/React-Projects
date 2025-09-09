export const formatUnixTimestampToHourMinute = (sunrise) => {
    const date = new Date(sunrise * 1000); 
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };