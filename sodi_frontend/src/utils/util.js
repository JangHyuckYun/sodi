export const debounce = (callback, duration) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), duration)
    };
};

const timeText = {
    kr: {
        second: "방금 전",
        minute: "분 전",
        hour: '시간 전',
        day: '일 전',
        week: '주 전',
        month: '개월 전',
        year: '년 전',
    },
    en: {
        second: "just a moment ago",
        minute: "minute ago",
        hour: 'hour ago',
        day: 'day ago',
        week: 'week ago',
        month: 'month ago',
        year: 'year ago',
    },
};

export const detailDate = (a) => {
    const language = "en";
    const milliSeconds = new Date() - a;
    const seconds = milliSeconds / 1000;
    if (seconds < 60) return `${timeText[language].second}`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)} ${timeText[language].minute}`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)} ${timeText[language].hour}`;
    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)} ${timeText[language].day}`;
    const weeks = days / 7;
    if (weeks < 5) return `${Math.floor(weeks)} ${timeText[language].week}`;
    const months = days / 30;
    if (months < 12) return `${Math.floor(months)} ${timeText[language].month}`;
    const years = days / 365;
    return `${Math.floor(years)} ${timeText[language].year}`;
};
