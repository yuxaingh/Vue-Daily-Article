<template>
    <div class="daily">
        <div class="daily-menu">
            <div class="daily-menu-item" :class="{on: type === 'recommend'}"
            @click="handleToRecommend">每日推荐</div>
            <div class="daily-menu-item" :class="{on: type === 'daily'}"
            @click="showThemes = !showThemes">主题日报</div>
            <ul v-show="showThemes">
                <li v-for="item in themes">
                    <a :class="{on: item.id === themeId && type === 'daily'}"
                    @click="handleToTheme(item.id)">{{item.name}}</a>
                </li>
            </ul>
        </div>
        <div class="daily-list" ref="list">
            <template v-if="type === 'recommend'">
                <div v-for="list in recommendList">
                    <div class="daily-date">{{formatDay(list.date)}}</div>
                    <Item v-for="item in list.stories" :data="item" :key="item.id"
                    @click.native="handleClick(item.id)"></Item>
                </div>
            </template>
             <template v-if="type === 'daily'">
                    <Item v-for="item in list" :data="item" :key="item.id"
                    @click.native="handleClick(item.id)"></Item>
            </template>
        </div>
        <div class="daily-list-loading-overlay" v-show="isLoading">
            <p class="daily-list-loading-overlay-text">Loading More...</p>
        </div>
        <daily-article :id="articleId"></daily-article>
    </div>
</template>
<script>
    import $ from './libs/util';
    import Item from './components/item.vue';
    import dailyArticle from './components/daily-article.vue';
    export default {
        components: {Item, dailyArticle},
        data() {
            return {
                themes: [],
                showThemes: false,
                type: 'recommend',
                themeId: 0,
                recommendList: [],
                list: [],
                dailyTime: $.getTodayTime(),
                isLoading: false,
                articleId: 0
            }
        },
        methods: {
            getThemes() {
                //Use axios to send get request
                $.ajax.get('themes').then(res => {
                    this.themes = res.others;
                })
            },
            handleToTheme(id) {
                //Change menu type
                this.type = 'daily';
                //Set theme id
                this.themeId = id;
                //Clear news list
                this.list = [];
                //GET request to get article list
                $.ajax.get('theme/'+ id).then(res => {
                    //Filter out the type that is equal to 1
                    this.list = res.stories.filter(item => item.type !== 1);
                })
            },
            handleToRecommend(){
                this.type = 'recommend';
                this.recommendList = [];
                this.dailyTime = $.getTodayTime();
                this.getRecommendList();
            },
            getRecommendList(){
                this.isLoading = true;
                const prevDay = $.prevDay(this.dailyTime + 86400000);
                $.ajax.get('news/before/' + prevDay).then(res => {
                    this.recommendList.push(res);
                    this.isLoading = false;
                })
            },
            //Tranform to date format to Chinese character
            formatDay(date){
                let month = date.substr(4,2);
                let day = date.substr(6,2);
                if (month.substr(0,1) === '0')
                    month = month.substr(1,1);
                if(day.substr(0,1) === '0')
                    day = day.substr(1,1);
                return `${month}月${day}日`;
             },
             handleClick(id) {
                 this.articleId = id;
             }
        },
        mounted() {
            //Initilaze thems list and recommendList after mounted
            this.getThemes();
            this.getRecommendList();
            //Add scroll event listener
            const $list = this.$refs.list;
            $list.addEventListener('scroll', () => {
                //Do nothing when it is on theme daily or it is isLoading
                if(this.type === 'daily' || this.isLoading) return;
                //If the scrolled height plus the view height is greater or equal to total height
                //load more news
                if($list.scrollTop + document.body.clientHeight >= $list.scrollHeight){
                    //Decrease timestamp by one day
                    this.dailyTime -= 86400000;
                    this.getRecommendList();
                }
            });
            $list.dispatchEvent(new Event("scroll"));
        }
    }
</script>