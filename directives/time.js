let Time = {
    getDate: function(time) {
        let date = new Date(time);
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return date.getFullYear() + '-' + month + '-' + day;
    },
    //Translated format
    getFormatTime(timestamp) {
        let now = new Date().getTime();
        let offset = (now - timestamp) / 1000;
        let tip = '';
        if(Math.floor(offset/60) <= 0){
            tip = 'Just now';
        }else if(offset < 3600){
            tip = Math.floor(offset/60) + ' mins ago';
        }else if(offset >= 3600 && offset < 86400){
            tip = Math.floor(offset/3600) + ' hours ago';
        }else if(offset/86400 <= 31){
            tip = Math.ceil(offset/86400) + ' days ago';
        }else{
            tip = this.getDate(timestamp);
        }
        return tip;
    }
};

export default {
    bind: function(el, binding){
        el.innerHTML = Time.getFormatTime(binding.value*1000);
        el._timeout_ = setInterval(function(){
            el.innerHTML = Time.getFormatTime(binding.value*1000);
        }, 60000);
    },
    unbind: function(el){
        clearInterval(el._timeout_);
        delete el._timeout_;
    }
}