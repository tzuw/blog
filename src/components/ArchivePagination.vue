<template>
    <div class="mt-3">

        <vnode-to-html :vnode="$slots.default" @html="html4ArticleTitles = $event"/>

        <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
        ></b-pagination>

        <ul class="pagination">
            <li class="page-item active"><a class="page-link">Total {{ totalRows }}</a></li>
        </ul>

        <div v-html="item" v-for="(item,index) in articleTitlesTemp" :key="index">
            {{ item }}
        </div>
    </div>
</template>

<script>
    // let dup = require('../public/assets/js/archive.js');
    import { onTagSelect } from '../public/assets/js/archive';
    export default {
        name: 'ArchivePagination',
        data: function() {
            return {
                totalPage: -1,
                perPage: 5,
                currentPage: 1,
                html4ArticleTitles: '',
                articleTitles: [],
                delimiter: '<h5></h5>',
                observer: null
            }
        },
        created() {
        },
        beforeDestroy: function() {
            this.observer.disconnect();
        },
        computed: {
            articleTitlesTemp () {
                return this.articleTitles.slice(this.perPage*(this.currentPage-1), this.perPage*(this.currentPage));
            },
            totalRows () {
                return this.articleTitles.length;
            }
        },
        watch: {
        },
        mounted() {
            /* WHY USE IN MOUNT HERE ? */
            this.parseArticleTitlesHtml(this.html4ArticleTitles);

            /* MutationObserver */
            this.observer = new MutationObserver(function(mutations) {
                this.parseArticleTitlesHtml(document.getElementById('tag_click').outerHTML);
            }.bind(this));

            this.observer.observe(
                document.getElementById('tag_click'),
                { attributes: true, childList: true, characterData: true, subtree: true }
            );
        },
        updated: function () {
            this.$nextTick(function () {
                /**
                 * Code that will run only after the entire view has been re-rendered
                 */
                onTagSelect();
            })
        },
        props: {
        },
        methods: {
            parseArticleTitlesHtml: function(html4Titles) {
                /**
                 * split the rendered html using 'delimiter'
                 */
                let pos = html4Titles.lastIndexOf("</div>");
                let temp = html4Titles.slice(0, pos) + html4Titles.slice(pos).replace("</div>", "");
                temp = temp.split("<section>").join("").split("</section>").join(""); // delete <section>

                /**
                 * eliminate tag_click id, which should only be found in template during replacing html content in slot.
                 */
                this.articleTitles = temp.replace("<div id=\"tag_click\">","")
                    .split(this.delimiter).slice(0, -1);

                /**
                 * filter of articles for tag selection
                 */
                this.articleTitles = this.articleTitles.filter(function(part) {
                    return part.indexOf("d-none") === -1;
                });
            },
            handler4TagClick: function() {
            }
        }
    }
</script>
