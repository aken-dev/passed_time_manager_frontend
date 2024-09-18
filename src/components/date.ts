export class DateCalc {

    static getTime(dateTime: Date): string{
        return `${dateTime.getFullYear()}/${dateTime.getMonth()+1}/${dateTime.getDate()}
         ${(dateTime.getHours() < 10 ? '0' : '')}${dateTime.getHours()}:${(dateTime.getMinutes() < 10 ? '0' : '')}${dateTime.getMinutes()}`;
    } 
    static getDiffTime(baseDateTime: Date, targetDateTime: Date): string | void{
        const diffYears = this.getDiffYears(baseDateTime, targetDateTime);
        if(diffYears) return diffYears;
        const diffMonths = this.getDiffMonths(baseDateTime, targetDateTime);
        if(diffMonths) return diffMonths;
        const diffDays = this.getDiffDays(baseDateTime, targetDateTime);
        if(diffDays) return diffDays;
        const diffHours = this.getDiffHours(baseDateTime, targetDateTime);
        if(diffHours) return diffHours;
        const diffMinutes = this.getDiffMinutes(baseDateTime, targetDateTime);
        if(diffMinutes) return diffMinutes;
        const diffSeconds = this.getDiffSeconds(baseDateTime, targetDateTime);
        if(diffSeconds) return diffSeconds;
        return '不明'
    }
    private static getDiffYears(baseDateTime: Date, targetDateTime: Date): string | void{
        const diff = Math.floor((baseDateTime.getTime() - targetDateTime.getTime()) / (1000 * 60 * 60 * 24 * 365));
        if(diff > 0){
            return `${diff}年`;
        }
        return
    }
    private static getDiffMonths(baseDateTime: Date, targetDateTime: Date): string | void{
        const diff = Math.floor((baseDateTime.getTime() - targetDateTime.getTime()) / (1000 * 60 * 60 * 24 * 30));
        if(diff > 0){
            return `${diff}ヶ月`;
        }
        return
    }
    private static getDiffDays(baseDateTime: Date, targetDateTime: Date): string | void{
        const diff = Math.floor((baseDateTime.getTime() - targetDateTime.getTime()) / (1000 * 60 * 60 * 24));
        if(diff > 0){
            return `${diff}日`;
        }
        return
    }
    private static getDiffHours(baseDateTime: Date, targetDateTime: Date): string | void{
        const diff = Math.floor((baseDateTime.getTime() - targetDateTime.getTime()) / (1000 * 60 * 60));
        if(diff > 0){
            return `${diff}時間`;
        }
        return
    }
    private static getDiffMinutes(baseDateTime: Date, targetDateTime: Date,): string | void{
        const diff = Math.floor((baseDateTime.getTime() - targetDateTime.getTime()) / (1000 * 60));
        if(diff > 0){
            return `${diff}分`;
        }
        return
    }
    private static getDiffSeconds(baseDateTime: Date, targetDateTime: Date,): string | void{
        const diff = Math.floor((baseDateTime.getTime() - targetDateTime.getTime()) / (1000));
        if(diff >= 0){
            return `${diff}秒`;
        }
        return 
    }
}