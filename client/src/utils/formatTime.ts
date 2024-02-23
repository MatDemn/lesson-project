export function stringToTime(strTime: string): number {
    const timeArr = strTime.split(":"), result = (+timeArr[0])*60 + (+timeArr[1]);
    return result;
}