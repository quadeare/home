const app = new Vue({
    el: '#app',
    data: {
        config: null,
        filter: '',
        vlayout: true,
        isDark: null
    },
    created: function () {
        let that = this;
        
        this.isDark = 'overrideDark' in localStorage ? 
            JSON.parse(localStorage.overrideDark) : matchMedia("(prefers-color-scheme: dark)").matches;

        if ('vlayout' in localStorage) {
            this.vlayout = JSON.parse(localStorage.vlayout)
        }
        
        that.getConfig().then(function (config) {
            that.config = config;
        });

    },
    methods: {
        getConfig: function (event) {
            return fetch('config.yml').then(function (response) {
                if (response.status != 200) {
                    return
                }
                return response.text().then(function (body) {
                    return jsyaml.load(body);
                });
            });
        },
        toggleTheme: function() {
            this.isDark = !this.isDark;
            localStorage.overrideDark = this.isDark; 
        }, 
        toggleLayout: function() {
            this.vlayout = !this.vlayout;
            localStorage.vlayout = this.vlayout; 
        }, 
    }
});

Vue.component('service', {
    props: ['item'],
    template: `<div>
    <div class="card">
        <a target="_blank" :href="item.url">
            <div class="card-content">
                <div class="media">
                    <div v-if="item.logo" class="media-left">
                        <figure class="image is-48x48">
                            <img :src="item.logo" />
                        </figure>
                    </div>
                    <div v-if="item.icon" class="media-left">
                        <figure class="image is-48x48">
                            <i style="font-size: 35px" :class="item.icon"></i>
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">{{ item.name }}</p>
                        <p class="subtitle is-6">{{ item.subtitle }}</p>
                    </div>
                </div>
                <div class="tag" :class="item.tagstyle" v-if="item.tag">
                    <strong class="tag-text">#{{ item.tag }}</strong>
                </div>
            </div>
        </a>
    </div></div>`
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/worker.js');
    });
}
