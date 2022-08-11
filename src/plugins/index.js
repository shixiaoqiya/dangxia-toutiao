import Vue from 'vue';

import { NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Popup, Col, Row, Badge, Search, Divider, Tag, CellGroup, Image, DatetimePicker, Dialog, ShareSheet, Uploader } from 'vant'

let plugins = [NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Popup, Col, Row, Badge, Search, Divider, Tag, CellGroup, Image, DatetimePicker, Dialog, ShareSheet, Uploader]

plugins.forEach((item) => {
    return Vue.use(item)
})
