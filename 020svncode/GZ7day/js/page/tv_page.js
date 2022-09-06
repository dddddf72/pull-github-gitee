SumaJS.registerModule("tv_page", (function() {
	var thisfirstPage=false;//是否为第一次加载 获取焦点时，更新2级菜单内容
    var groupName = "";
    var epgTimer = -1;
    var leftProImg;
    function onCreate(param) {
        thisPageName = SysSetting.getEnv("curPageName"); //获取当前页面名称
        SumaJS.debug("tv_page thisPageName = " + thisPageName);
        thisPageIndex = menuDataAccessObj.getPageIndexByName(thisPageName);
        SumaJS.$("#shouye").style.display = "block";
        var renderConfig = {
            "entry": {
                "type": "div",
                "properties": {
                    "innerHTML": "&nbsp;",
                    "id": "tv_page_context"
                },
                "childNodes": [{ //小视频窗口
                        "type": "div",
                        "properties": {
                            "id": "tv_page_small_video"
                        }
                    },
                    {
                        "type": "div",
                        "properties": {
                            "id": "tv_page_small_video_focus"
                        }
                    },
                    { //列表
                        "type": "div",
                        "properties": {
                            "id": "tv_page_columns"
                        },
                        "childNodes": [{
                            "type": "div",
                            "properties": {
                                "id": "tv_page_left_group" //左侧列表
                            },
                            "childNodes": [{
                                    "type": "div",
                                    "properties": {
                                        "id": "tv_page_left_focus"
                                    }
                                },
                                {
                                    "type": "list",
                                    "listCount": "4",
                                    "properties": {
                                        "id": "tv_page_left_ul_dom"
                                    },
                                    "itemTemplate": {
                                        "styles": {},
                                        "childNodes": [{
                                            "type": "div",
                                            "properties": {
                                                "className": "tv_page_left_group",
                                                "id": "tv_page_left_ul_$i"
                                            }
                                        }]
                                    }
                                }
                            ]
                        }, {
                            "type": "div",
                            "properties": {
                                "id": "tv_page_right_group" //分组列表
                            },
                            "childNodes": [{
                                    "type": "div",
                                    "properties": {
                                        "id": "tv_page_group_focus",
                                        "innerHTML": "<img src='images/main_page/group_focus.png'/>"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "tv_page_group_arrow_up",
                                        "innerHTML": "<img src='images/main_page/group_arrow_up.png'/>"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "tv_page_group_arrow_down",
                                        "innerHTML": "<img src='images/main_page/group_arrow_down.png'/>"
                                    }
                                },
                                {
                                    "type": "list",
                                    "listCount": "5",
                                    "properties": {
                                        "id": "tv_page_group_ul_dom"
                                    },
                                    "itemTemplate": {
                                        "styles": {
                                            "list-style": "none",
                                            "text-align": "center",
                                            "width": "250px",
                                            "height": "47px",
                                            "line-height": "47px",
                                            "overflow": "hidden",
                                            "text-overflow": "ellipsis",
                                            "white-space": "nowrap"
                                        },
                                        "childNodes": [{
                                            "type": "div",
                                            "properties": {
                                                "id": "tv_page_group_ul_$i"
                                            }
                                        }]
                                    }
                                }
                            ]
                        }]
                    },
                    { //推荐位
                        "type": "div",
                        "properties": {
                            "id": "tv_page_recommend"
                        },
                        "childNodes": [{
                                "type": "div",
                                "properties": {
                                    "id": "tv_page_recommend_focus" //推荐位焦点
                                },
                                "styles": {
                                    "position": "absolute",
                                    "display": "none",
                                    "z-index": "3"
                                }
                            },
                            {
                                "type": "list",
                                "listCount": "6",
                                "itemTemplate": {
                                    "styles": {},
                                    "childNodes": [{
                                        "type": "img",
                                        "properties": {
                                            "id": "tv_page_recommend_$i"
                                        }
                                    }]
                                }
                            }

                        ]
                    },
                    { //频道列表
                        "type": "div",
                        "properties": {
                            "id": "tv_page_channel_name_list1"
                        },
                        "childNodes": [{
                                "type": "div",
                                "properties": {
                                    "className": "focus"
                                }
                            }, { //常看设置图标
                                "type": "div",
                                "properties": {
                                    "id": "often_watch_tip"
                                },
                                "childNodes": [{
                                    "type": "div",
                                    "properties": {
                                        "id": "often_watch_tip_bg",
                                        "innerHTML": "<img src='images/tv_page/often_watch_set_bg.png'/>"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "often_watch_tip_img",
                                        "innerHTML": "<img src='images/tv_page/often_watch_set_unfocus.png'/>"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "often_watch_tip_text",
                                        "innerHTML": "常看设置"
                                    }
                                }]
                            }, { //常看设置图标-选中
                                "type": "div",
                                "properties": {
                                    "id": "often_watch_tip_focus"
                                },
                                "childNodes": [{
                                    "type": "div",
                                    "properties": {
                                        "id": "often_watch_tip_bg_focus",
                                        "innerHTML": "<img src='images/tv_page/often_watch_set_bg_focus.png'/>"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "often_watch_tip_img_focus",
                                        "innerHTML": "<img src='images/tv_page/often_watch_set_focus.png'/>"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "often_watch_tip_text_focus",
                                        "innerHTML": "常看设置"
                                    }
                                }]
                            }, {
                                "type": "div",
                                "properties": {
                                    "id": "tv_page_channel_name_list1_context"
                                },
                                "childNodes": [{
                                    "type": "list",
                                    "listCount": "9",
                                    "itemTemplate": {
                                        "styles": {
                                            "height": "47px",
                                            "width": "300px",
                                            "font-size": "20px",
                                            "list-style": "none",
                                            "white-space": "nowrap",
                                        },
                                        "childNodes": [{
                                                "type": "div",
                                                "properties": {
                                                    "innerHTML": "&nbsp;",
                                                    "className": "kandian_icon",
                                                    "id": "kandian_icon_$i"

                                                }
                                            }, {
                                                "type": "div",
                                                "styles": {

                                                },
                                                "properties": {
                                                    // "innerHTML": "CCTV-1",
                                                    "className": "channelname",
                                                    "id": "channelname_$i"
                                                }
                                            }, {
                                                "type": "div",
                                                "properties": {
                                                    "innerHTML": "<img src='images/tv_page/right_arrow.png'/>",
                                                    "className": "rightarrow_icon",
                                                    "id": "rightarrow_icon_$i"
                                                }
                                            },
                                            {
                                                "type": "div",
                                                "properties": {
                                                    "innerHTML": "",
                                                    "className": "timeshift_icon",
                                                    "id": "timeshift_icon_$i"

                                                }
                                            }
                                        ]
                                    }
                                }]
                            }, {
                                "type": "div",
                                "properties": {
                                    "id": "tv_page_channel_name_list1_cursor_slider"
                                },
                            }, {
                                "type": "div",
                                "properties": {
                                    "id": "tv_page_epg" //epg列表
                                },
                                "childNodes": [{
                                        "type": "div",
                                        "properties": {
                                            "id": "tv_page_epg_now" //正播
                                        },
                                        "childNodes": [{
                                                "type": "div",
                                                "properties": {
                                                    "id": "tv_page_epg_now_text",
                                                    "innerHTML": "正播"
                                                },
                                            }, {
                                                "type": "div",
                                                "properties": {
                                                    "id": "tv_page_epg_now_time",
                                                    //"innerHTML": "15:30"
                                                },
                                            }, {
                                                "type": "div",
                                                "properties": {
                                                    "id": "tv_page_epg_now_type",
                                                    //"innerHTML": "发现:"
                                                },
                                            }, {
                                                "type": "div",
                                                "properties": {
                                                    "id": "tv_page_epg_now_name",
                                                    //"innerHTML": "国家宝藏"
                                                },
                                            }

                                        ]
                                    }, {
                                        "type": "img",
                                        "properties": {
                                            "id": "tv_page_epg_progress", //进度条
                                            "src": 'images/tv_page/progress_bar.png'
                                                //"innerHTML": "<img src='images/tv_page/progress_bar.png'/>"
                                        }
                                    }, {
                                        "type": "div",
                                        "properties": {
                                            "id": "tv_page_epg_list" //epg列表
                                        },
                                        "childNodes": [{
                                            "type": "list",
                                            // "listCount": "7",
                                            "listCount": "8",
                                            "itemTemplate": {
                                                "styles": {
                                                    "height": "45px",
                                                    "width": "320px",
                                                    "font-size": "20px",
                                                    "list-style": "none",
                                                    "white-space": "nowrap",
                                                    "border": "0px"
                                                },
                                                "childNodes": [{
                                                    "type": "div",
                                                    "properties": {
                                                        "innerHTML": "&nbsp;",
                                                        "className": "epg_event_time",
                                                        "id": "epg_event_time_$i",
                                                        //"innerHTML": "17:30"
                                                    }
                                                }, {
                                                    "type": "div",
                                                    "properties": {
                                                        "innerHTML": "&nbsp;",
                                                        "className": "epg_event_type",
                                                        "id": "epg_event_type_$i",
                                                        //"innerHTML": "人文地理:"
                                                    }
                                                }, {
                                                    "type": "div",
                                                    "properties": {
                                                        "innerHTML": "&nbsp;",
                                                        "className": "epg_event_name",
                                                        "id": "epg_event_name_$i",
                                                        //"innerHTML": "西津渡"
                                                    }
                                                }]
                                            }
                                        }]
                                    }
                                    // ,{
                                    //     "type":"div",
                                    //     "properties":{
                                    //         "id":"tv_page_epg_recommend"
                                    //     },
                                    //     "childNodes":[
                                    //         {
                                    //             "type":"div",
                                    //             "properties":{
                                    //                 "id":"tv_page_epg_recommend_tip",
                                    //                 "innerHTML":"推荐"
                                    //             }
                                    //         },
                                    //         {
                                    //             "type":"div",
                                    //             "properties":{
                                    //                 "id":"tv_page_epg_recommend_title",
                                    //                 //"innerHTML":"我是姜浩"
                                    //             }
                                    //         },
                                    //         {
                                    //             "type":"img",
                                    //             "properties":{
                                    //                 "id":"tv_page_epg_recommend_img",
                                    //                 "src":"images/tv_page/recommend_default.png"
                                    //             }
                                    //         },
                                    //         {
                                    //             "type":"div",
                                    //             "properties":{
                                    //                 "id":"tv_page_epg_recommend_content",
                                    //                 //"innerHTML":"我是姜浩，我是姜浩，我是姜浩，我是姜浩"
                                    //             }
                                    //         }
                                    //     ]
                                    // }
                                ]
                            }, {
                                "type": "div",
                                "properties": {
                                    "id": "setting_menu_panel" //常看设置面板
                                },
                                "childNodes": [{
                                        "type": "div",
                                        "properties": {
                                            "id": "setting_focus"
                                        }
                                    },
                                    {
                                        "type": "div",
                                        "properties": {
                                            "id": "setting_menu_0",
                                            "className": "setting_menu",
                                            "innerHTML": "选择"
                                        }
                                    }, {
                                        "type": "div",
                                        "properties": {
                                            "id": "setting_menu_1",
                                            "className": "setting_menu",
                                            "innerHTML": "排序"
                                        }
                                    }, {
                                        "type": "div",
                                        "properties": {
                                            "id": "setting_menu_2",
                                            "className": "setting_menu",
                                            "innerHTML": "删除"
                                        }
                                    }
                                ]
                            }

                        ]

                    },
                    { //常看设置列表
                        "type": "div",
                        "properties": {
                            "id": "tv_page_channel_name_list2"
                        },
                        "childNodes": [{
                                "type": "div",
                                "properties": {
                                    //"innerHTML": "<img src='images/often_watch/often_order_move.png'/>",
                                    "className": "focus"
                                }
                            }, {
                                "type": "div",
                                "properties": {
                                    "id": "tv_page_set_list"
                                },
                                "childNodes": [{
                                    "type": "list",
                                    "listCount": "8",
                                    "itemTemplate": {
                                        "styles": {
                                            "height": "47px",
                                            "width": "300px",
                                            "font-size": "20px",
                                            "list-style": "none",
                                            "white-space": "nowrap",
                                        },
                                        "childNodes": [{
                                            "type": "div",
                                            "styles": {

                                            },
                                            "properties": {
                                                "innerHTML": "CCTV-1",
                                                "className": "set_channelname",
                                                "id": "set_channelname_$i"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "className": "set_choose_icon",
                                                "id": "set_choose_icon_$i",
                                                "innerHTML": "<img src='images/often_watch/check_box_unchecked.png'/>"
                                            }
                                        }]
                                    }
                                }]
                            }, {
                                "type": "div",
                                "properties": {
                                    "id": "set_list_text",
                                    "innerHTML": "[返回]保存设置"
                                }
                            }, {
                                "type": "div",
                                "properties": {
                                    "id": "set_list_cursor_slider"
                                },
                            }, {
                                "type": "img",
                                "properties": {
                                    "id": "set_list_ad",
                                    "src": "images/often_watch/set_list_ad.png"
                                }
                            }

                        ]

                    },
                    { //全部频道
                        "type": "div",
                        "properties": {
                            "id": "tv_page_channel_name_list3"
                        },
                        "childNodes": [{
                            "type": "div",
                            "properties": {
                                "className": "focus",
                                "innerHTML": "<img src='images/tv_page/all_service_focus.png'/>",
                            }
                        }, {
                            "type": "div",
                            "properties": {
                                "id": "tv_page_colume_1",
                                "className": "tv_page_colume"
                            },
                            "childNodes": [{
                                    "type": "list",
                                    "listCount": "9",
                                    "itemTemplate": {
                                        "styles": {
                                            "height": "47px",
                                            "width": "240px",
                                            "line-height": "47px",
                                            "font-size": "18px",
                                            "list-style": "none",
                                            "white-space": "nowrap",
                                        },
                                        "childNodes": [{
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "001",
                                                "className": "ch_num",
                                                "id": "ch_num_1_$i"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "CCTV-1",
                                                "className": "ch_name",
                                                "id": "ch_name_1_$i"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "<img src='images/tv_page/right_arrow.png'/>",
                                                "className": "ch_right",
                                                "id": "ch_right_1_$i"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "&nbsp;",
                                                "innerHTML": "<img src='images/tv_page/timeshift_small.png'/>",
                                                "className": "ch_flag",
                                                "id": "ch_flag_1_$i"
                                            }
                                        }]
                                    }
                                }

                            ]
                        }, {
                            "type": "div",
                            "properties": {
                                "id": "tv_page_colume_2",
                                "className": "tv_page_colume"
                            },
                            "childNodes": [{
                                    "type": "list",
                                    "listCount": "9",
                                    "itemTemplate": {
                                        "styles": {
                                            "height": "47px",
                                            "width": "240px",
                                            "line-height": "47px",
                                            "font-size": "18px",
                                            "list-style": "none",
                                            "white-space": "nowrap",
                                        },
                                        "childNodes": [{
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "001",
                                                "className": "ch_num",
                                                "id": "ch_num_1_$i"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "CCTV-1",
                                                "className": "ch_name",
                                                "id": "ch_name_1_$i"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "<img src='images/tv_page/right_arrow.png'/>",
                                                "className": "ch_right",
                                                "id": "ch_right_1_$i"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "&nbsp;",
                                                "innerHTML": "<img src='images/tv_page/timeshift_small.png'/>",
                                                "className": "ch_flag",
                                                "id": "ch_flag_1_$i"
                                            }
                                        }]
                                    }
                                }

                            ]
                        }, {
                            "type": "div",
                            "properties": {
                                "id": "tv_page_colume_3",
                                "className": "tv_page_colume"
                            },
                            "childNodes": [{
                                    "type": "list",
                                    "listCount": "9",
                                    "itemTemplate": {
                                        "styles": {
                                            "height": "47px",
                                            "width": "240px",
                                            "line-height": "47px",
                                            "font-size": "18px",
                                            "list-style": "none",
                                            "white-space": "nowrap",
                                        },
                                        "childNodes": [{
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "001",
                                                "className": "ch_num",
                                                "id": "ch_num_1_$i"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "CCTV-1",
                                                "className": "ch_name",
                                                "id": "ch_name_1_$i"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "<img src='images/tv_page/right_arrow.png'/>",
                                                "className": "ch_right",
                                                "id": "ch_right_1_$i"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "innerHTML": "&nbsp;",
                                                "innerHTML": "<img src='images/tv_page/timeshift_small.png'/>",
                                                "className": "ch_flag",
                                                "id": "ch_flag_1_$i"
                                            }
                                        }]
                                    }
                                }

                            ]
                        }, { //右侧小点
                            "type": "div",
                            "properties": {
                                "id": "tv_page_channel_name_list3_flip_point"
                            },
                            "childNodes": [{
                                "type": "list",
                                "listCount": "10",
                                "properties": {
                                    "id": "flip_point_ul_dom"
                                },
                                "itemTemplate": {
                                    "styles": {},
                                    "childNodes": [{
                                        "type": "div",
                                        "properties": {
                                            "className": "flip_point",
                                            "innerHTML": "<img src='images/tv_page/flip_point_black.png'/>"
                                        }
                                    }]
                                }
                            }]
                        }]
                    },
                    { //音量控制
                        "type": "div",
                        "properties": {
                            "id": "tv_page_volume_bar"
                        },
                        "childNodes": [{
                            "type": "div",
                            "properties": {
                                "id": "tv_page_volume_bar_symbol"
                            }
                        }, {
                            "type": "div",
                            "properties": {
                                "id": "tv_page_volume_bar_progress"
                            }
                        }, {
                            "type": "div",
                            "properties": {
                                "innerHTML": "10",
                                "id": "tv_page_volume_bar_num"
                            }
                        }]
                    }, {
                        "type": "div",
                        "properties": {
                            "id": "tv_page_volume_mute"
                        }
                    },
                    { //清理面板
                        "type": "div",
                        "properties": {
                            "id": "tv_page_clear_Panel"
                        },
                        "styles": {
                            "position": "absolute",
                            "display": "none",
                            "z-index": "3"
                        },
                        "childNodes": [{
                                "type": "div",
                                "properties": {
                                    "className": "pannel_title",
                                    "innerHTML": "清空已设常看频道"
                                }
                            }, {
                                "type": "div",
                                "properties": {
                                    "className": "panel_left_ul"
                                },
                                "childNodes": []
                            }, {
                                "type": "div",
                                "properties": {
                                    "className": "panel_mid_ul"
                                }
                            }, {
                                "type": "div",
                                "properties": {
                                    "className": "panel_right_ul"
                                }
                            }, {
                                "type": "div",
                                "properties": {
                                    "id": "panel_enter_but",
                                    "innerHTML": "确&nbsp;&nbsp;定"
                                }
                            }, {
                                "type": "div",
                                "properties": {
                                    "id": "panel_cancel_but",
                                    "innerHTML": "取&nbsp;&nbsp;消"
                                }
                            }

                        ]
                    },
                    { //海报下的横线
                        "type": "div",
                        "properties": {
                            "id": "tv_page_under_line"
                        }
                    },
                    { //遮罩层
                        "type": "div",
                        "properties": {
                            "id": "shouye_mask_layer"
                        }
                    },
                    { //分组列表确定键焦点框后
                        "type": "div",
                        "properties": {
                            "id": "tv_page_group_select_focus"
                        },
                        "childNodes": [{
                            "type": "div",
                            "properties": {
                                "id": "tv_page_group_select_name"
                            }
                        }]
                    }

                ]
            }
        };

        this.render(renderConfig);
        SumaJS.$("#tv_page_context").style.display = "block";
    }

    function onStart() {
        //if (SumaJS.lastModuleName == "") {
          //  smallHomeVideo.playByOrder(7, 0); //将小视频播放移到此处。
        //}
        var tvPageObj = new function() {
            /*************字号 start****************/
            var FONT_NUM_1 = "24px";
            var FONT_NUM_2 = "22px";
            var FONT_NUM_3 = "20px";
            var FONT_NUM_4 = "18px";
            /*************字号 end****************/

            //获取除音频外的全部频道，并按照logicalChannelId排序
            var allServices = SumaJS.getAllVideoServiceOrderByLogicalId();
            //var allServices = analogAllService;
            SumaJS.debug("tv_page allServices = " + allServices.length);

            SumaJS.showDateTime("header_time", "header_date"); //显示时间
            IcCard.checkICCard();
            var checkICCard = new IntervalTask(function() {
                IcCard.checkICCard();
            }, IcCard.timeOut);
            //SumaJS.globalTimerManager.add("checkICCard", checkICCard);
			
            var tvPageEventHandler = { //用来处理该页面的按键事件
                eventHandler: function(event) {
                    var keyCode = event.keyCode || event.which;
                    SumaJS.debug("tvPageEventHandler keyCode = " + keyCode);
                    switch (keyCode) {
                        case KEY_NUM1:
                        case KEY_NUM2:
                        case KEY_NUM3:
                        case KEY_NUM4:
                        case KEY_NUM5:
                        case KEY_NUM6: //处理海报位的跳转                      
                            var num = keyCode - 49;
                            if (recommendObj.listObj.pageSize >= num) {
                                var thisData = recommendObj.listObj.getItems()[num];
                                if (typeof thisData.src == "string") {
                                    //数据采集
                                    DataCollection.collectData(["0a", thisData.windowId, thisData.windowName, thisData.name, thisData.src]);
                                    closeCycleControl.setNode(thisPageName, [recommendObj.listObj.getIndex()], "recommend");
                                    closeCycleControl.pushNodeToStack();
                                    closeCycleControl.saveStack();
                                    jumpPathInitialization(thisData.src);
                                }
                            } else {
                                SumaJS.debug("tvPageEventHandler enter a wrong number");
                            }
                            return false;
                        case KEY_NUM7:
                            //window.location.href = "index.html";
                            return false;
                        case KEY_NUM8:
                            //alert("CA区域码: "+CA.regionCode);
                            return false;
                        case KEY_NUM9: //测试关机频道
                            var thisChannel = OffChannelObj.getOffChannel();
                            var thisService = SumaJS.getServiceByLogicalChannelId(thisChannel.logicalChannelId);
                            //alert(thisService.serviceName);
                            return false;
                        case KEY_VOLUME_UP:
                            if (volumebar) {
                                SumaJS.debug("tvPageEventHandler volume up");
                                volumebar.volumeUp(currentService, { curService: currentService, code: KEY_VOLUME_UP });
                            }
                            return false;
                        case KEY_VOLUME_DOWN:
                            if (volumebar) {
                                SumaJS.debug("tvPageEventHandler volume down");
                                volumebar.volumeDown(currentService, { curService: currentService, code: KEY_VOLUME_DOWN });
                            }
                            return false;
                        case KEY_MUTE:
                            if (volumebar) {
                                SumaJS.debug("tvPageEventHandler volume mute");
                                volumebar.muteFunc();
                            }
                            return false;
                        case KEY_TV: //保存title获焦
                        case KEY_BACK:
                        case KEY_EXIT: //返回、退出、电视键进全屏
                            freePreviewFlag = false;
                            closeCycleControl.setNode(thisPageName, [thisPageIndex], "Title");
                            closeCycleControl.pushNodeToStack();
                            if (keyCode == KEY_TV) { //按照顺序获取，不包括nvod。
                                //var service = smallHomeVideo.getServiceByOrder(4,1);  //电视键为4
                                var service = smallHomeVideo.getServiceWhenEnterPlayTv(4); //电视键为4
                                //以下数据采集相关
                                if (service) {
                                    if (smallHomeVideo.hasRecService(4, 1)) {
                                        SysSetting.setEnv("HOMETOPLAYTV", "14");
                                    } else {
                                        SysSetting.setEnv("HOMETOPLAYTV", "08");
                                    }
                                }
                            } else if (keyCode == KEY_EXIT) {
                                //var service = smallHomeVideo.getServiceByOrder(5,1);  //退出键为5
                                var service = smallHomeVideo.getServiceWhenEnterPlayTv(5); //退出键为5
                                if (smallHomeVideo.hasRecService(5, 1)) {
                                    changeTvMode = "15";
                                } else {
                                    changeTvMode = "0e";
                                }
                            } else {
                                //var service = smallHomeVideo.getServiceByOrder(6,1);
                                var service = smallHomeVideo.getServiceWhenEnterPlayTv(6);
                                if (smallHomeVideo.hasRecService(6, 1)) {
                                    changeTvMode = "16";
                                } else {
                                    changeTvMode = "0f";
                                }
                            }
                            OffChannelObj.saveOffChannelToM(service);
                            OffChannelObj.saveOffChannel(service);
                            SumaJS.debug("KEY_EXITTV channel = " + JSON.stringify(service));
                            titleObj.loseFocus(); //title,header和footer都失去焦点
                            headerObj.loseFocus();
                            footerObj.loseFocus();
                            SumaJS.loadModule("play_tv");
                            //setTimeout(function(){SumaJS.loadModule("play_tv");}, 1500);
                            return false;
                        case KEY_INFO: //信息键 进每日推荐
                        case KEY_BLUE: //蓝色键 全局搜索页面
                            closeCycleControl.setNode(SumaJS.currModuleName, [1], "Title");
                            closeCycleControl.pushNodeToStack();
                            closeCycleControl.saveStack();
                            if (keyCode == KEY_INFO) {
                                var dayUrl = menuDataAccessObj.getDayUrlByJson();
                                var url = pathInitialization(dayUrl);
                                if (url != "") {
                                    var xmlhttp = new XMLHttpRequest();
                                    xmlhttp.onreadystatechange = function() {
                                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                                            SumaJS.debug("tv_page enter dayrecommend ok");
                                            window.location.href = url;
                                        } else {
                                            SumaJS.debug("tv_page enter dayrecommend not ok");
                                        }
                                    };
                                    xmlhttp.open("GET", url, false);
                                    xmlhttp.send();
                                } else {
                                    SumaJS.debug("tv_page enter dayrecommend url=='';");
                                }
                            } else {
                                SumaJS.debug("tv_page enter search");
                                var url = pathInitialization("/NewFrameWork/web/searchEx/index.html");
                                SumaJS.debug("tv_page enter search  url = " + url);
                                window.location.href = url;
                            }
                            return false;
                        default:
                            return true;
                    }
                }
            };
            SumaJS.eventManager.addEventListener("tvPageEventHandler", tvPageEventHandler, 101);
            var smallVideoObj = new function() { //小视频窗口对象
                this.focus = 0;
                var self = this;
                this.focusBg = SumaJS.$("#tv_page_small_video_focus");
                this.initial = function() {
                	if (SumaJS.lastModuleName == "") {
			           // smallHomeVideo.playByOrder(7, 0); //将小视频播放移到此处。
			        }
                };
                this.eventHandler = function(event) {
                    var keyCode = event.keyCode || event.which;
                    SumaJS.debug("tv_page smallVideoObj keyCode = " + keyCode);
                    switch (keyCode) {
                        case KEY_LEFT:
                            return false;
                        case KEY_RIGHT:
                            if (recommendObj.listObj.getItems().length > 0) {
                                this.loseFocus();
                                recommendObj.getFocus(0);
                            }
                            return false;
                        case KEY_UP:
                            this.loseFocus();
                            //titleObj.getFocus(menuDataAccessObj.getPageIndexByName(SumaJS.currModuleName));
                            titleObj.getFocus(menuDataAccessObj.getPageIndexByName(thisPageName));
                            return false;
                        case KEY_DOWN:
                            if (groupListObj.listObj.getItems().length > 0) {
                                this.loseFocus();
                                groupListObj.getFocus(0);
                            } else if (leftListObj.listObj.getItems().length > 0) {
                                this.loseFocus();
                                leftListObj.getFocus(0);
                            }
                            return false;
                        case KEY_ENTER:
                        	closeCycleControl.clearStackS();	
                            closeCycleControl.setNode(thisPageName, [0], "SmallVideo");
                            closeCycleControl.pushNodeToStack();
                            if (smallHomeVideo.getIsPlayingNvod()) { //判定正在播放nvod
                                var nvodObj = smallHomeVideo.getNvodObj();
                                var obj = { NvodSource: nvodObj };
                                SumaJS.loadModule("play_tv", JSON.stringify(obj));
                            } else if (currentService) {
                                if (typeof currentService.serviceType != "undefined" && currentService.serviceType != 2) { //非广播节目
                                    //数据采集
                                    changeTvMode = "43";
                                    OffChannelObj.saveOffChannelToM(currentService);
                                    OffChannelObj.saveOffChannel(currentService);
                                    SumaJS.loadModule("play_tv");
                                }
                            }
                            return false;
                        default:
                            return true;
                    }
                };
                this.getFocus = function() {
                    this.focus = 1;
                    SumaJS.eventManager.addEventListener("SmallVideoEventHandler", this, 100);
                    this.focusBg.style.display = "block";
                };
                this.loseFocus = function() {
                    this.focus = 0;
                    SumaJS.eventManager.removeEventListener("SmallVideoEventHandler");
                    this.focusBg.style.display = "none";
                };
            };
            //数据采集使用
            function getParentIDByPageName(name) {
                if (name == "local_page") {
                    return "01";
                } else if (name == "tv_page") {
                    return "02";
                } else if (name == "video_page") {
                    return "03";
                } else if (name == "application_page") {
                    return "04";
                } else if (name == "my_page") {
                    return "05";
                } else {
                    return "01";
                }
            }
            var leftListObj = new function() { //左侧列表对象
                this.focus = 0;
                var self = this;
                this.borderColorArr = ["#526BA3", "#F19702"]; //border颜色数组，第一个为非选中颜色，第二个为选中颜色
                this.wordColorArr = ["#d2dce6", "#ffffff"]; //字体颜色数组，第一个为非选中颜色，第二个为选中颜色
                var cfg = {
                    items: [],
                    type: 1,
                    pageSize: 4,
                    uiObj: {
                        focusBg: SumaJS.$("#tv_page_left_focus"),
                        imgArray: SumaJS.$("#tv_page_left_ul_dom .tv_page_left_group")
                    },
                    showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                        if (!subItems) {
                            for (var i = 0; i < this.pageSize; ++i) {
                                uiObj.imgArray[i].innerHTML = "";
                            }
                        } else {
                            if (isUpdate) {
                                for (var i = 0; i < this.pageSize; i++) {
                                    if (subItems[i] && typeof subItems[i].name == "string") {
                                        if (thisPageName == 'tv_page') {
                                            uiObj.imgArray[i].innerHTML = "<img src='" + subItems[i].logo + "'/>" + "&nbsp" + subItems[i].name;
                                        } else {
                                            uiObj.imgArray[i].innerHTML = subItems[i].name;
                                        }
                                    } else {
                                        uiObj.imgArray[i].innerHTML = "";
                                    }
                                }
                            } else if (lastFocusPos > -1) {
                                uiObj.imgArray[lastFocusPos].style.borderColor = self.borderColorArr[0];
                                uiObj.imgArray[lastFocusPos].style.color = self.wordColorArr[0];
                            }
                            if (focusPos > -1 && self.focus == 1) {
                                uiObj.imgArray[focusPos].style.borderColor = self.borderColorArr[1];
                                uiObj.imgArray[focusPos].style.color = self.wordColorArr[1];
                                uiObj.focusBg.style.top = (59 * focusPos - 12) + "px";
                            }
                        }
                    },
                    onSelect: function(item) {
                        //直播页二级菜单左侧上报
                        var id = item.id;
                        var name = item.name;
                        var PARENT_ID = getParentIDByPageName(thisPageName);
                        var type = "01";
                        DataCollection.collectData(["02", id, PARENT_ID, type, 2, name]);

                        closeCycleControl.setNode(thisPageName, [self.listObj.getIndex()], "LeftList");
                        closeCycleControl.pushNodeToStack();
                        closeCycleControl.saveStack();
                        jumpPathInitialization(item.addr);

                    }
                };
                this.listObj = new SubList(cfg);

                this.initial = function() {
                    SumaJS.debug("tv_page leftListObj initial entered");
                    var leftData = menuDataAccessObj.getSecondLeftOrRightData(thisPageName, "left");
                    if (leftData.length > 4) {
                        leftData.splice(4, leftData.length - 4); //截取掉多余的
                    }
                    for (var i = 0; i < leftData.length; i++) {
                        this.listObj.uiObj.imgArray[i].style.display = "block";
                    }
                     for (var i = leftData.length; i < this.listObj.pageSize; i++) {
                        this.listObj.uiObj.imgArray[i].style.display = "none";
                    }
                    this.listObj.pageSize = leftData.length; //数据有多少,长度就是多少	
                    this.listObj.resetData({ index: 0, items: leftData });
                };
                this.eventHandler = function(event) {
                    var keyCode = event.keyCode || event.which;
                    SumaJS.debug("leftListObjEvent keyCode = " + keyCode);
                    switch (keyCode) {
                        case KEY_LEFT:
                            return false;
                        case KEY_RIGHT:
                            if (groupListObj.listObj.getItems().length > 0) {
                                this.loseFocus();
                                groupListObj.getFocus(0);
                            }
                            return false;
                        case KEY_UP:
                            if (self.listObj.getIndex() == 0) {
                                self.loseFocus();
                                smallVideoObj.getFocus();
                            } else {
                                self.listObj.up();
                            }
                            return false;
                        case KEY_DOWN:
                            if (self.listObj.getIndex() == self.listObj.pageSize - 1) {
                                self.loseFocus();
                                footerObj.getFocus();
                            } else {
                                self.listObj.down();
                            }
                            return false;
                        case KEY_ENTER:
                            self.listObj.select();
                            return false;
                        default:
                            return true;
                    }
                };
                this.getFocus = function(index) {
                    this.focus = 1;
                    self.listObj.uiObj.focusBg.style.display = "block";
                    SumaJS.eventManager.addEventListener("leftListObjEvent", this, 100);
                    if (typeof index != "number") { index = 0; }
                    index = index >= this.listObj.getItems().length ? 0 : index;
                    self.listObj.setIndex(index);
                    self.listObj.upDate();
                };
                this.loseFocus = function() {
                    this.focus = 0;
                    this.clearFocusBg();
                    self.listObj.uiObj.focusBg.style.display = "none";
                    SumaJS.eventManager.removeEventListener("leftListObjEvent");
                    self.listObj.upDate();
                };
                this.clearFocusBg = function() {
                    for (var i = 0; i < this.listObj.pageSize; i++) {
                        this.listObj.uiObj.imgArray[i].style.borderColor = self.borderColorArr[0];
                        this.listObj.uiObj.imgArray[i].style.color = self.wordColorArr[0];
                    }
                };
            };

            var groupListObj = new function() { //分组列表对象
                this.focus = 0;
                var self = this;
                //this.changIndexFlag = false; //按确定键时索引是否变化。
                this.lastIndex = -1; //上一个索引
                this.thisIndex=-1;//初始
                //this.firstEnterFlag = true; //首次按确定键
                this.colorArr = ["#d2dce6", "#ffffff"]; //颜色数组，第一个为非选中颜色，第二个为选中颜色
                var nameDom = []; //分组列表的dom
                for (var i = 0; i < 5; i++) {
                    nameDom[i] = SumaJS.getDom("tv_page_group_ul_" + i);
                }
                var cfg = {
                    items: [],
                    type: 2,
                    delayTime: 200,
                    pageSize: 5,
                    uiObj: {
                        nameArray: nameDom,
                        focusBg: SumaJS.$("#tv_page_group_focus"),
                        selectFocusBg: SumaJS.$("#tv_page_group_select_focus"), //确定键选中后的焦点
                        allUI: SumaJS.$("#tv_page_right_group") //属于该block的UI
                    },
                    showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                        if (!subItems) {
                            for (var i = 0; i < uiObj.nameArray.length; ++i) {
                                uiObj.nameArray[i].innerHTML = "";
                            }
                            self.showUpOrDownArrow(3);
                        } else {
                            if (isUpdate) {
                                for (var i = 0; i < uiObj.nameArray.length; ++i) {
                                    self.lostStyle(i);
                                    if (subItems[i]) {
                                        uiObj.nameArray[i].innerHTML = subItems[i].name;
                                    } else {
                                        uiObj.nameArray[i].innerHTML = "";
                                    }
                                }
                            } else if (lastFocusPos > -1) {
                                self.lostStyle(lastFocusPos);
                            }
                            if (focusPos > -1 && self.focus) {
                                //uiObj.focusBg.style.top = (47*focusPos-22)+"px";
                                uiObj.focusBg.style.top = (47 * focusPos - 23) + "px";
                                if (self) {
                                    self.setStyleOnFocus(focusPos);
                                }
                            }

                            //add by liwenlei ,用来显示向下向上箭头
                            var len = this.getItems().length;
                            if (this.startIndex != 0) {
                                if (parseInt(this.startIndex + this.pageSize) < len) {
                                    self.showUpOrDownArrow(2);
                                } else {
                                    self.showUpOrDownArrow(1);
                                }
                            } else {
                                if (parseInt(this.startIndex + this.pageSize) < len) {
                                    self.showUpOrDownArrow(0);
                                } else {
                                    self.showUpOrDownArrow(3);
                                }
                            }
                        }
                    },
                    onSelect: function(item) {
                        var id = item.id;
                        var name = item.name;
                        var PARENT_ID = getParentIDByPageName(thisPageName);
                        DataCollection.collectData(["02", id, PARENT_ID, dataCollectType, 2, name]);
                        if (thisPageName == "tv_page") {
                            var dataCollectType = "00"; // 数据上报使用
                             if (!thisfirstPage) {
                                oftenSet();
                                thisfirstPage = true;
                            }
                            self.lastIndex = self.thisIndex;
                            self.thisIndex = this.getIndex();
                            //if (self.firstEnterFlag) { //首次按确定键,不设置分组变化
                              //  self.lastIndex = self.thisIndex;
                               // self.firstEnterFlag = false;
                            //} else if (self.thisIndex != self.lastIndex) { //非首次按确定键且索引变化
                               // self.lastIndex = self.thisIndex;
                                //self.changIndexFlag = true;
                            //}
                            if (typeof item.type != "undefined" && typeof item.addr != "undefined") {
                                dataCollectType = "01"
                                    //菜单数据获取到的，需跳转portal
                                closeCycleControl.setNode(thisPageName, [groupListObj.listObj.getIndex()], "GroupList");
                                closeCycleControl.pushNodeToStack();
                                closeCycleControl.saveStack();
                                jumpPathInitialization(item.src);
                            } else { //是配置表中的二级菜单
                                switch (item.name) {
                                    case "常看频道":
                                        showOftenWatchService();
                                        allChannelObj.nowIndex = -1;
                                        //channelListObj.getFocus();
                                        break;
                                    case "全部频道":
                                        //allChannelObj.listObj.resetData({index:0, items:allServices});
                                        //allChannelObj.getFocus(self.whichIndex(currentService,allServices));
                                        allChannelObj.getFocus();
                                        break;
                                    default:
                                        var services = this.items[this.index].services;
                                        channelListObj.listObj.resetData({ index: 0, items: services });
                                        channelListObj.getFocus();
                                        allChannelObj.nowIndex = -1;
                                        break;
                                }
                            }
                        } else {
                            closeCycleControl.setNode(thisPageName, [self.listObj.getIndex()], "GroupList");
                            closeCycleControl.pushNodeToStack();
                            closeCycleControl.saveStack();
                            jumpPathInitialization(item.addr);
                        }

                    }
                };
                this.listObj = new SubList(cfg);
                this.initial = function() {
                    SumaJS.debug("tv_page groupListObj initial entered");
                    if (thisPageName == "tv_page") {
                        if (!SumaJS.globalServiceInfo) {
                            SumaJS.getServiceInfo();
                        }
                        var tempGroupName = [];
                        var DVBGroupArray = SumaJS.globalServiceInfo;
                        for (var i = 0; i < DVBGroupArray.length; i++) { //去除配置表中的全部频道
                            if (DVBGroupArray[i].name == "全部频道") {
                                DVBGroupArray.splice(i, 1);
                            }
                        }
                        tempGroupName[0] = { "GroupId": -1, "name": "常看频道" };
                        tempGroupName[1] = { "GroupId": 10018, "name": "全部频道" };
                        var allFlag = 0;
                        for (var i = 0; i < DVBGroupArray.length; i++) {
                            tempGroupName[i + 2] = DVBGroupArray[i];
                        }
                        var rightData = menuDataAccessObj.getSecondLeftOrRightData("tv_page", "right");
                        if (typeof rightData == "object" && rightData.length > 0) {
                            SumaJS.debug("tv_page groupListObj concat rightData");
                            tempGroupName = tempGroupName.concat(rightData);
                        }
                        this.listObj.resetData({ index: 0, items: tempGroupName });
                    } else {
                        var rightData = menuDataAccessObj.getSecondLeftOrRightData(thisPageName, "right");
                        this.listObj.resetData({ index: 0, items: rightData });
                    }

                };
                this.showUpOrDownArrow = function(type) { //显示或隐藏向下向上箭头 0-显示向下, 1-显示向上, 2-都显示, 3-都不显示
                    switch (parseInt(type)) {
                        case 0:
                            SumaJS.$("#tv_page_group_arrow_up").style.display = "none";
                            SumaJS.$("#tv_page_group_arrow_down").style.display = "block";
                            break;
                        case 1:
                            SumaJS.$("#tv_page_group_arrow_up").style.display = "block";
                            SumaJS.$("#tv_page_group_arrow_down").style.display = "none";
                            break;
                        case 2:
                            SumaJS.$("#tv_page_group_arrow_up").style.display = "block";
                            SumaJS.$("#tv_page_group_arrow_down").style.display = "block";
                            break;
                        case 3:
                            SumaJS.$("#tv_page_group_arrow_up").style.display = "none";
                            SumaJS.$("#tv_page_group_arrow_down").style.display = "none";
                            break;
                        default:
                            SumaJS.$("#tv_page_group_arrow_up").style.display = "none";
                            SumaJS.$("#tv_page_group_arrow_down").style.display = "none";
                    }
                };
                this.lostStyle = function(pos) { //失焦时的样式变化
                    self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[0];
                    self.listObj.uiObj.nameArray[pos].style.fontSize = FONT_NUM_3;
                    self.listObj.uiObj.nameArray[pos].style.fontWeight = "";
                };
                this.setStyleOnFocus = function(focusPos) { //获焦时样式设置
                    self.listObj.uiObj.nameArray[focusPos].style.color = self.colorArr[1];
                    self.listObj.uiObj.nameArray[focusPos].style.fontWeight = "bold";
                    self.listObj.uiObj.nameArray[focusPos].style.fontSize = FONT_NUM_2;
                    for (var i = 0; i != focusPos && i < self.listObj.uiObj.nameArray.length; i++) {
                        self.listObj.uiObj.nameArray[i].style.color = self.colorArr[0];
                    }
                    if (thisPageName == "tv_page") {
                        self.listObj.uiObj.selectFocusBg.style.display = "none";
                        SumaJS.$("#shouye_mask_layer").style.display = "none";
                    } else {
                        self.listObj.uiObj.nameArray[focusPos].style.backgroundImage = "url()";
                    }
                };
                this.setStyleOnSelect = function(focusPos) { //确定键选择后失焦

                    self.listObj.uiObj.focusBg.style.display = "none";
                    self.listObj.uiObj.selectFocusBg.style.display = "block";

                    var thisName = self.listObj.getItem().name;
                    SumaJS.$("#tv_page_group_select_name").innerHTML = thisName;

                    self.listObj.uiObj.selectFocusBg.style.top = (47 * focusPos + 203) + "px";
                    SumaJS.$("#shouye_mask_layer").style.display = "block";

                };
                this.eventHandler = function(event) {
                    var keyCode = event.keyCode || event.which;
                    SumaJS.debug("tv_page GroupListEventHandler keyCode = " + keyCode);
                    switch (keyCode) {
                        case KEY_LEFT:
                            if (leftListObj.listObj.getItems().length > 0) {
                                this.loseFocus();
                                leftListObj.getFocus(0);
                            } else {
                                SumaJS.debug("leftListObj.listObj.length = 0");
                            }
                            return false;
                        case KEY_RIGHT:
                            if (recommendObj.listObj.getItems().length > 0) {
                                this.loseFocus();
                                recommendObj.getFocus(0);
                            } else {
                                SumaJS.debug("recommendObj.listObj.length = 0");
                            }
                            return false;
                        case KEY_UP:
                            if (self.listObj.getIndex() == 0) {
                                this.loseFocus();
                                smallVideoObj.getFocus();
                            } else {
                                self.listObj.up();
                            }
                            return false;
                        case KEY_DOWN:
                            if (self.listObj.getIndex() == self.listObj.getItems().length - 1) {
                                this.loseFocus();
                                footerObj.getFocus();
                            } else {
                                self.listObj.down();
                            }
                            return false;
                        case KEY_PAGE_DOWN:
                            self.listObj.pageDown();
                            return false;
                        case KEY_PAGE_UP:
                            self.listObj.pageUp();
                            return false;
                        case KEY_ENTER:
                            this.loseFocusByEnter();
                            self.listObj.select();
                            return false;
                        default:
                            return true;
                    }
                };
                this.getFocus = function(obj) {
                    this.focus = 1;
                    SumaJS.eventManager.addEventListener("groupListObjEvent", this, 100);
                    self.listObj.uiObj.focusBg.style.display = "block";
                    if (thisPageName == "tv_page") {
                        self.listObj.refresh();
                        switch (typeof obj) {
                            case "object":
                                return false;
                            case "string": //添加确定键进入下一级菜单
                                var thisIndex = parseInt(obj, 10);
                                thisIndex = thisIndex >= this.listObj.getItems().length ? 0 : thisIndex;
                                self.listObj.setIndex(thisIndex);
                                self.listObj.upDate();
                                this.loseFocusByEnter();
                                return false;
                            case "number":
                                var thisIndex = parseInt(obj, 10);
                                thisIndex = thisIndex >= this.listObj.getItems().length ? 0 : thisIndex;
                                self.listObj.setIndex(thisIndex);
                                self.listObj.upDate();
                                return false;
                            default:
                                this.setStyleOnFocus(self.listObj.getFocusPos());
                                return false;
                        }
                    } else {
                        if (typeof obj != "number") { obj = 0; }
                        obj = obj >= this.listObj.getItems().length ? 0 : obj;
                        self.listObj.setIndex(obj);
                        self.listObj.upDate();
                    }
                };
                this.loseFocus = function() {
                    this.focus = 0;
                    self.listObj.uiObj.focusBg.style.display = "none";
                    if (thisPageName == "tv_page") {
                        self.listObj.uiObj.selectFocusBg.style.display = "none";
                        SumaJS.$("#shouye_mask_layer").style.display = "none";
                    }
                    self.lostStyle(self.listObj.getFocusPos());
                    SumaJS.eventManager.removeEventListener("groupListObjEvent");
                };
                this.loseFocusByEnter = function() { //进入下一层级导致的失焦
                    self.setStyleOnSelect(self.listObj.getFocusPos());
                };
            	this.whichIndex = function(son,parent){
            		for (var i = 0;i<parent.length;i++) {
            			if(son.serviceId==parent[i].serviceId){
            				return i;
            			}else{
            				continue;
            			}
            		}
            	}
            };

            var recommendObj = new function() { //推荐位对象
                this.focus = 0;
                this.recommendFlag=true;
                var self = this;
                var nameDom = []; //分组列表的dom
                for (var i = 0; i < 6; i++) {
                    nameDom[i] = SumaJS.getDom("tv_page_recommend_" + i);
                }
                var cfg = {
                    items: [],
                    type: 1,
                    pageSize: 6,
                    uiObj: {
                        imgArray: nameDom,
                        focusBg: SumaJS.$("#tv_page_recommend_focus"),
                        allUI: SumaJS.$("#tv_page_recommend"), //属于该block的UI
                    },
                    showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                        if (!subItems) {
                            for (var i = 0; i < this.pageSize; ++i) {
                                //uiObj.imgArray[i].innerHTML = "";
                                uiObj.imgArray[i].src = "";
                            }
                        } else {
                            if (isUpdate) {
                                for (var i = 0; i < this.pageSize; ++i) {
                                    if (subItems[i]) {
                                        //uiObj.imgArray[i].innerHTML = "<img src='"+subItems[i].img+"'/>"; 
                                        uiObj.imgArray[i].src = subItems[i].img;
                                    } else {
                                        //uiObj.imgArray[i].innerHTML = "";
                                        uiObj.imgArray[i].src = "";
                                    }
                                }
                                if (this.pageSize == 5) {
                                    uiObj.imgArray[4].style.width = "714px";
                                    uiObj.imgArray[5].style.display = "none"; //隐藏最后一个
                                } else if (this.pageSize == 6) {
                                    uiObj.imgArray[4].style.width = "354px";
                                    uiObj.imgArray[5].style.display = "block"; //显示最后一个
                                }
                            }
                            if (focusPos > -1) {
                                if (focusPos < 4) {
                                    uiObj.focusBg.innerHTML = "<img src='images/main_page/rec_up_focus.png'/>";
                                    uiObj.focusBg.style.left = -24 + focusPos * 180 + "px";
                                    uiObj.focusBg.style.top = "-23px";
                                    uiObj.focusBg.style.width = "222px";
                                    uiObj.focusBg.style.height = "309px";

                                } else {
                                    if (this.pageSize == 5) { //下方为一张大海报时                                        
                                        uiObj.focusBg.innerHTML = "<img src='images/main_page/rec_down_big_focus.png'/>"
                                        uiObj.focusBg.style.left = -18 + "px";
                                        uiObj.focusBg.style.top = "258px";
                                        uiObj.focusBg.style.width = "750px";
                                        uiObj.focusBg.style.height = "200px";
                                    } else if (this.pageSize == 6) { //下方为两张小海报时                                       
                                        uiObj.focusBg.innerHTML = "<img src='images/main_page/rec_down_small_focus.png'/>";
                                        uiObj.focusBg.style.left = -24 + (focusPos - 4) * 360 + "px";
                                        uiObj.focusBg.style.top = "253px";
                                        uiObj.focusBg.style.width = "402px";
                                        uiObj.focusBg.style.height = "208px";
                                    }


                                }

                            }
                        }
                    },
                    onSelect: function(item) {
                        if (typeof item.src == "string") {
                            //数据采集
                            DataCollection.collectData(["0a", item.windowId, item.windowName, item.name, item.src]);

                            closeCycleControl.setNode(thisPageName, [self.listObj.getIndex()], "recommend");
                            closeCycleControl.pushNodeToStack();
                            closeCycleControl.saveStack();
                            jumpPathInitialization(item.src);
                        } else {
                            SumaJS.debug("tv_page recommendObj onSelect item.src is undefined");
                        }
                    },
                };
                this.listObj = new SubList(cfg);
                this.defaultArray = [{ img: "images/tv_page/1.png" }, { img: "images/tv_page/2.png" }, { img: "images/tv_page/3.png" },
                    { img: "images/tv_page/4.png" }, { img: "images/tv_page/6.png" }
                ];
                this.initial = function() {
                    SumaJS.debug("tv_page recommendObj initial entered");
                    //首先显示默认图片，再刷新
                    //this.listObj.pageSize = 5;
                    //recommendObj.listObj.resetData({ index: 0, items: this.defaultArray });
                    try {
                        switch (thisPageName) {
                            case "tv_page":
                                var arr = portalAd.getTypeArr("index_tv");
                                break;
                            case "local_page":
                                var arr = portalAd.getTypeArr("index_local");
                                break;
                            case "video_page":
                                var arr = portalAd.getTypeArr("index_vod");
                                break;
                            case "application_page":
                                var arr = portalAd.getTypeArr("index_app");
                                break;
                            case "my_page":
                                var arr = portalAd.getTypeArr("index_home");
                                break;
                            default:
                                var arr = [];
                        }
                        if (arr.length > 6) {
                            arr.splice(6, arr.length - 6); //大于6个时，截取掉后面的
                        }
                        switch (arr.length) {
                            case 0:
                                this.listObj.pageSize = 5;
                                arr=this.defaultArray;
                                var preImg =portalAd.preLoadImg(this.defaultArray);
                                break;
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                                this.listObj.pageSize = 5;
                                var addArr = this.defaultArray.slice(arr.length);
                                arr = arr.concat(addArr);
                                var preImg =portalAd.preLoadImg(this.defaultArray);
                                break;
                            case 5:
                                this.listObj.pageSize = 5;
                                break;
                            case 6:
                                this.listObj.pageSize = 6;
                                break;
                        }
                     	if (this.recommendFlag) {
                    		recommendObj.listObj.resetData({ index: 0, items: arr });
                    	} else{
                    		var preImg =portalAd.preLoadImg(arr);
	                    	preImg[this.defaultArray.length-1].onload=function(){
	                        	recommendObj.listObj.resetData({ index: 0, items: arr });
	                        	preImg=null;
	                       	}
                    	}
                    } catch (e) {
                    	this.listObj.pageSize = 5;
                    	if (this.recommendFlag) {
                    		recommendObj.listObj.resetData({ index: 0, items: this.defaultArray });
                    	} else{
                    		var preImg =portalAd.preLoadImg(this.defaultArray);
	                    	preImg[this.defaultArray.length-1].onload=function(){
	                        	recommendObj.listObj.resetData({ index: 0, items: this.defaultArray });
	                        	preImg=null;
	                       	}
                    	}
                    	SumaJS.debug("tv_page recommendObj initial error");
                    }
                };
                this.eventHandler = function(event) {
                    var keyCode = event.keyCode || event.which;
                    SumaJS.debug("tv_page RecommendObjEvent keyCode = " + keyCode);
                    switch (keyCode) {
                        case KEY_LEFT:
//                          window.recommendEnterTime = true;
                            var thisIndex = self.listObj.getIndex();
                            switch (thisIndex) {
                                case 0:
                                    this.loseFocus();
                                    smallVideoObj.getFocus();
                                    break;
                                case 4:
                                    if (groupListObj.listObj.getItems().length > 0) {
                                        this.loseFocus();
                                        groupListObj.getFocus();
                                    }
                                    break;
                                default:
                                    self.listObj.up();
                                    break;
                            }
                            return false;
                        case KEY_RIGHT:
//                          window.recommendEnterTime = true;
                            var thisIndex = self.listObj.getIndex();
                            switch (thisIndex) {
                                case 3:
                                case 5:
                                    //this.loseFocus();
                                    //smallVideoObj.getFocus();
                                    break;
                                case 4:
                                    if (self.listObj.pageSize == 6) {
                                        self.listObj.down();
                                        break;
                                    }
                                    break;
                                default:
                                    self.listObj.down();
                                    break;
                            }
                            return false;
                        case KEY_UP:
//                          window.recommendEnterTime = true;
                            var thisIndex = self.listObj.getIndex();
                            switch (thisIndex) {
                                case 4:
                                    self.listObj.setIndex(0);
                                    self.listObj.upDate();
                                    break;
                                case 5:
                                    self.listObj.setIndex(3);
                                    self.listObj.upDate();
                                    break;
                                default:
                                    this.loseFocus();
                                    //titleObj.getFocus(menuDataAccessObj.getPageIndexByName(SumaJS.currModuleName));
                                    titleObj.getFocus(menuDataAccessObj.getPageIndexByName(thisPageName));
                                    break;
                            }
                            return false;
                        case KEY_DOWN:
//                          window.recommendEnterTime = true;
                            var thisIndex = self.listObj.getIndex();
                            switch (thisIndex) {
                                case 0:
                                case 1:
                                    self.listObj.setIndex(4);
                                    self.listObj.upDate();
                                    break;
                                case 2:
                                case 3:
                                    if (self.listObj.pageSize == 6) {
                                        self.listObj.setIndex(5);
                                    } else {
                                        self.listObj.setIndex(4);
                                    }
                                    self.listObj.upDate();
                                    break;
                                case 4:
                                case 5:
                                    this.loseFocus();
                                    footerObj.getFocus();
                                    break;
                                default:
                                    break;
                            }
                            return false;
                        case KEY_ENTER:
//                          if (typeof recommendEnterTime == 'undefined' || recommendEnterTime) {
                                self.listObj.select();
//                              window.recommendEnterTime = false;
//                              setTimeout(function() {
//                                  delete window.recommendEnterTime;
//                              }, 2000);
//                          }
                            //self.listObj.select();                     
                            return false;
                        default:
                            return true;
                    }
                };
                this.getFocus = function(obj) {
                    this.focus = 1;
                    SumaJS.eventManager.addEventListener("RecommendObjEvent", this, 100);
                    self.listObj.uiObj.focusBg.style.display = "block";
                    switch (typeof obj) {
                        case "object":
                            return false;
                        case "number":
                            var thisIndex = parseInt(obj, 10);
                            thisIndex = thisIndex >= this.listObj.getItems().length ? 0 : thisIndex;
                            self.listObj.setIndex(thisIndex);
                            self.listObj.upDate();
                            return false;
                        default:
                            self.listObj.setIndex(0);
                            self.listObj.upDate();
                            return false;
                    }
                };
                this.loseFocus = function() {
                    this.focus = 0;
                    SumaJS.eventManager.removeEventListener("RecommendObjEvent");
                    self.listObj.uiObj.focusBg.style.display = "none";
                };
            };
            var channelListObj, allChannelObj, setting_model, setPanelObj, ftenSetListObj, tvOftenData, clearPanelObj, tvOftenData;
            if(thisfirstPage || closeCycleControl.checkIfDoCloseCycle(thisPageName) && !SumaJS.lastModuleName && thisPageName =='tv_page' ){
            	oftenSet();
            	thisfirstPage=true;
            }
            function oftenSet() {
                channelListObj = new function() { //频道列表对象
                    this.focus = 0;
                    var self = this;
                    this.tempch = null;
                    this.focusPose='';
                    this.lastIndex = -1; //用来记录当前的index，判定刷新后是否需要重新播放
                    this.area = 0; //0:频道区域，1：回看按钮区域。
                    //this.colorArr = ["#E6E5B3","#E1E1E1"];  //颜色数组，第一个为非选中颜色，第二个为选中颜色
                    this.colorArr = ["#d2dce6", "#ffffff", "#E6E5B3", "#E1E1E1"]; //颜色数组，第一个为非常看非选中，第二个为非常看选中 ，第三那个为常看非选中，第四个为常看选中
                    this.forceGetEpg = false; //强制获取二级菜单右侧的EPG和推荐信息
                    this.sliderDom = SumaJS.$("#tv_page_channel_name_list1_cursor_slider"); //右侧的滑条
                    this.tipFlag = false; //当前页面元素是否有常看设置
                    var cfg = {
                        items: [],
                        type: 2,
                        delayTime: 200,
                        pageSize: 9,
                        uiObj: {
                            allUI: SumaJS.$("#tv_page_channel_name_list1"),
                            kandianArray: SumaJS.$("#tv_page_channel_name_list1 .kandian_icon"),
                            nameArray: SumaJS.$("#tv_page_channel_name_list1 .channelname"),
                            rightarrowArray: SumaJS.$("#tv_page_channel_name_list1 .rightarrow_icon"),
                            flagArray: SumaJS.$("#tv_page_channel_name_list1 .timeshift_icon"),
                            focusBg: SumaJS.$("#tv_page_channel_name_list1 .focus")[0]
                        },
                        showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                            if (!subItems) {
                                for (var i = 0; i < uiObj.kandianArray.length; ++i) {
                                    uiObj.kandianArray[i].style.backgroundImage = "url()";
                                    uiObj.nameArray[i].innerHTML = "&nbsp;";
                                    uiObj.rightarrowArray[i].style.display = "none";
                                    uiObj.flagArray[i].innerHTML = "";
                                }
                                uiObj.focusBg.style.display = "none";
                            } else {
                                SumaJS.debug("@@@isUpdate=" + isUpdate + "   lastFocusPos=" + lastFocusPos + "   focusPos=" + focusPos + "  this.pageSize=" + this.pageSize);
                                if (isUpdate) {
                                    for (var i = 0; i < this.pageSize; ++i) {
                                        var service = subItems[i];
                                        if (service) {
                                            if (service.serviceName == "##001") {
                                                uiObj.kandianArray[i].style.backgroundImage = "url()";
                                                //uiObj.nameArray[i].innerHTML = "<img src='images/tv_page/often_watch_set.png'/>"; //用来显示图片											
                                                uiObj.nameArray[i].innerHTML = "";
                                                self.showTipUnfocus(i);
                                                self.tipFlag = true;

                                                uiObj.rightarrowArray[i].style.display = "none";
                                                uiObj.flagArray[i].innerHTML = "";
                                            } else {
                                                //uiObj.kandianArray[i].style.backgroundImage = kanDianChannels[service.OriginalNetworkId+"_"+service.TsId+"_"+service.ServiceId]?"url(images/kandian1.png)":"url()";
                                                uiObj.nameArray[i].innerHTML = service.serviceName;
                                                uiObj.rightarrowArray[i].style.display = "none";
                                                uiObj.flagArray[i].innerHTML = service.playback ? "<img src='images/tv_page/timeshift_small.png'/>" : "";
                                                //uiObj.nameArray[i].style.color = self.colorArr[0];
                                                if (groupListObj.listObj.getIndex() == 0) {
                                                    uiObj.nameArray[i].style.color = self.colorArr[2];
                                                } else {
                                                    uiObj.nameArray[i].style.color = self.colorArr[0];
                                                }

                                                uiObj.flagArray[i].style.left = "232px";
                                            }

                                        } else {
                                            uiObj.kandianArray[i].style.backgroundImage = "url()";
                                            uiObj.nameArray[i].innerHTML = "";
                                            uiObj.rightarrowArray[i].style.display = "none";
                                            uiObj.flagArray[i].innerHTML = "";
                                        }

                                    }
                                    if (!self.tipFlag) { //没有的话则隐藏
                                        self.hideTip();
                                    } else {
                                        self.tipFlag = false;
                                    }
                                }
                                if (lastFocusPos > -1) {
                                    self.lostStyle(lastFocusPos);
                                    if (subItems[lastFocusPos] && typeof subItems[lastFocusPos].serviceName != "undefined") {
                                        if (subItems[lastFocusPos].serviceName != "##001") {
                                            uiObj.nameArray[lastFocusPos].innerHTML = subItems[lastFocusPos].serviceName;
                                        } else {
                                            //uiObj.nameArray[lastFocusPos].innerHTML = "<img src='images/tv_page/often_watch_set.png'/>";
                                            self.showTipUnfocus(lastFocusPos);
                                        }
                                        uiObj.flagArray[lastFocusPos].innerHTML = subItems[lastFocusPos].playback ? "<img src='images/tv_page/timeshift_small.png'/>" : "";
                                    }
                                }
                                if (focusPos > -1) {
                                    uiObj.focusBg.style.top = 35 + 47 * focusPos + "px";
                                    uiObj.rightarrowArray[focusPos].style.top = 2 + 47 * focusPos + "px";
                                    self.tempch = subItems[focusPos];
                                    self.focusPose=focusPos;
                                    if (self.area == 0) {
                                        self.setStyleOnFocus(focusPos);
                                        if (subItems[focusPos].serviceName != "##001") {
                                            uiObj.focusBg.style.display = "block";
                                            uiObj.nameArray[focusPos].innerHTML = displayText(subItems[focusPos].serviceName, 185, 22);
                                        } else {
                                            //uiObj.nameArray[focusPos].innerHTML = "<img src='images/tv_page/often_watch_set.png'/>";
                                            self.showTipFocus(focusPos);
                                            uiObj.focusBg.style.display = "none";
                                        }
                                        if (subItems[focusPos].playback) {
                                            uiObj.flagArray[focusPos].innerHTML = "<img src='images/tv_page/timeshift_big.png'/>";
                                            uiObj.rightarrowArray[focusPos].style.display = "block";
                                        } else {
                                            uiObj.flagArray[focusPos].innerHTML = "";
                                            uiObj.rightarrowArray[focusPos].style.display = "none";
                                        }
                                        //添加回看图片位置
                                        uiObj.flagArray[focusPos].style.left = "242px";

                                    } else if (self.area == 1) {
                                        self.setStyleLostFocus(focusPos, "right");
                                        uiObj.focusBg.style.display = "none";
                                        uiObj.focusBg.style.backgroundImage = "";
                                        uiObj.flagArray[focusPos].innerHTML = subItems[focusPos].playback ? "<img src='images/tv_page/timeshift_focus.png'/>" : "";
                                        //添加回看图片位置
                                        uiObj.flagArray[focusPos].style.left = "242px";
                                    }
                                }
                            }

                            //播放该service
                            var mtime = (new Date()).getTime();
                            var delayTime = 200;
                            if (mtime - lastPlayTime < 800) {
                                delayTime = 800;
                            }
                            lastPlayTime = mtime;
                            //changeTvMode = "19";
                            var tempCh = this.getItem();
                            SumaJS.debug("test tempCh = " + JSON.stringify(tempCh));
                            var thisIndex = this.getIndex();
                            if (tempCh && typeof tempCh.serviceName != "undefined" && tempCh.serviceName != "##001") {
                                if (groupListObj.lastIndex != groupListObj.thisIndex) { //group索引是否变化
                                //if (groupListObj.changIndexFlag) { //group索引是否变化
                                    playCurrentService(tempCh, delayTime);
                                    //groupListObj.changIndexFlag = false;
                                } else if (self.lastIndex != thisIndex) { //索引有变化则调用播放接口
                                    playCurrentService(tempCh, delayTime);
                                    self.lastIndex = thisIndex;
                                } else if (self.forceGetEpg) { //当二级菜单展开时，第一个节目有可能和小视频是同一个节目，导致不会重新播放，但epg信息需要再次获取
                                    getEPGandRecommend();
                                    self.forceGetEpg = false;
                                }
                            }
                            self.showSlider(thisIndex); //右侧滑动条的显示
                        },
                        onSelect: function(item) {
                            var thisIndex = this.getIndex();
                            if (self.area == 0) {
                                if (item.serviceName == "##001") {
                                    SumaJS.debug("open panel");
                                    self.listObj.uiObj.focusBg.style.display = "none";
                                    self.showTipUnfocus(this.getFocusPos());
                                    setPanelObj.getFocus();
                                } else {
                                   /* if (self.eventHandler && !(currentService.serviceType === 2)) {
                                        //self.loseFocus();
                                    }*/
                                    if (currentService.serviceType === 2) {
                                        SumaJS.debug("tv_page channelListObj this service.ServiceType = 2");
                                    } else {
                                        //数据采集
                                        if (groupListObj.listObj.getItem().name == "常看频道" && isRecServices(item)) {
                                            changeTvMode = "26";
                                        } else if (groupListObj.listObj.getItem().name == "常看频道") {
                                            changeTvMode = "44";
                                        } else {
                                            changeTvMode = "45";
                                        }
                                        closeCycleControl.setNode("tv_page", [groupListObj.listObj.getIndex() + "a", thisIndex], "ChannelList");
                                        closeCycleControl.pushNodeToStack();
                                        OffChannelObj.saveOffChannelToM(item);
                                        OffChannelObj.saveOffChannel(item);
                                        SumaJS.loadModule("play_tv");
                                    }
                                }
                            } else if (self.area == 1) {
                                closeCycleControl.setNode("tv_page", [groupListObj.listObj.getIndex() + "a", thisIndex + "a"], "ChannelList");
                                closeCycleControl.pushNodeToStack();
                                closeCycleControl.saveStack();

                                var thisChannelId = item.channelId;
                                jumpPathInitialization("/NewFrameWork/UE/html/backlist.html?channelId=" + thisChannelId);
                            }
                        }
                    };
                    this.listObj = new SubList(cfg);
                    this.showTipUnfocus = function(index) { //常看设置未获焦		
                        SumaJS.$("#often_watch_tip_focus").style.display = "none"; //隐藏获焦状态
                        var dom = SumaJS.$("#often_watch_tip");
                        dom.style.display = "block";
                        dom.style.top = 63 + parseInt(index) * 47 + "px";

                    };
                    this.showTipFocus = function(index) { //常看设置未获焦	
                        SumaJS.$("#often_watch_tip").style.display = "none"; //隐藏未获焦状态
                        var dom = SumaJS.$("#often_watch_tip_focus");
                        dom.style.display = "block";
                        dom.style.top = 63 + parseInt(index) * 47 + "px";
                    };
                    this.hideTip = function() {
                        SumaJS.$("#often_watch_tip").style.display = "none";
                        SumaJS.$("#often_watch_tip_focus").style.display = "none";
                    };

                    this.showSlider = function(pos) { //显示进度条
                        var len = self.listObj.getItems().length;
                        //self.sliderDom.style.top = 14+pos/len*450+"px";					
                        self.sliderDom.style.top = 14 + pos / (len - 1) * 442 + "px";
                    };
                    this.initial = function() {
                        SumaJS.debug("tv_page channelListObj initial entered");
                        //this.listObj.uiObj.flagArray[1].style.backgroundColor = "red";
                        //this.listObj.uiObj.nameArray[1].style.backgroundColor = "red";
                    };
                    this.setStyleOnFocus = function(pos) { //获焦样式
                        self.listObj.uiObj.focusBg.style.display = "block";
                        self.listObj.uiObj.focusBg.style.left = "22px";
                        self.listObj.uiObj.focusBg.style.width = "260px";
                        self.listObj.uiObj.focusBg.style.height = "100px";
                        self.listObj.uiObj.focusBg.style.backgroundImage = "url(images/tv_page/often_watch_focus.png)";
                        //self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[1];
                        if (groupListObj.listObj.getIndex() == 0) {
                            self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[3];
                        } else {
                            self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[1];
                        }
                        self.listObj.uiObj.nameArray[pos].style.fontSize = FONT_NUM_2;
                        self.listObj.uiObj.nameArray[pos].style.fontWeight = "bold";
                        self.listObj.uiObj.nameArray[pos].style.overflow = "hidden";
                    };
                    this.setStyleLostFocus = function(focusPos, direction) { //失焦时样式
                        try {
                            if (direction == "left") {
                                self.listObj.uiObj.nameArray[focusPos].style.fontSize = FONT_NUM_3;
                                self.listObj.uiObj.nameArray[focusPos].style.fontWeight = "normal";
                            } else if (direction == "right") {
                                self.listObj.uiObj.nameArray[focusPos].style.fontSize = FONT_NUM_2;
                                self.listObj.uiObj.nameArray[focusPos].style.fontWeight = "bold";
                                //self.listObj.uiObj.nameArray[focusPos].style.color = self.colorArr[1];
                                if (groupListObj.listObj.getIndex() == 0) {
                                    self.listObj.uiObj.nameArray[focusPos].style.color = self.colorArr[3];
                                } else {
                                    self.listObj.uiObj.nameArray[focusPos].style.color = self.colorArr[1];
                                }
                                self.listObj.uiObj.nameArray[focusPos].style.overflow = "hidden";
                            }
                        } catch (e) {}
                    };
                    this.lostStyle = function(pos) { //焦点框上下移动时,失焦时样式变化
                        //self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[0];
                        if (groupListObj.listObj.getIndex() == 0) {
                            self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[2];
                        } else {
                            self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[0];
                        }
                        self.listObj.uiObj.nameArray[pos].style.fontSize = FONT_NUM_3;
                        self.listObj.uiObj.nameArray[pos].style.fontWeight = "normal";
                        self.listObj.uiObj.rightarrowArray[pos].style.display = "none";
                        self.listObj.uiObj.flagArray[pos].style.left = "232px";
                        self.listObj.uiObj.nameArray[pos].style.overflow = "visible";
                    };
                    this.eventHandler = function(event) {
                        var keyCode = event.keyCode || event.which;
                        switch (keyCode) {
                            case KEY_LEFT:
                                switch (self.area) {
                                    case 0:
                                        this.setStyleLostFocus(self.listObj.getFocusPos(), "left");
                                        this.loseFocus();
                                        groupListObj.getFocus();
                                        break;
                                    case 1:
                                        self.area = 0;
                                        self.listObj.upDate();
                                        break;
                                }
                                return false;
                            case KEY_RIGHT:
                                switch (self.area) {
                                    case 0:
                                        if (self.listObj.getItem().playback) {
                                            self.area = 1;
                                            //self.listObj.upDate();
                                            this.setStyleLostFocus(self.listObj.getFocusPos(), "right");
                                       		self.listObj.uiObj.focusBg.style.display = "none";
                                        	self.listObj.uiObj.focusBg.style.backgroundImage = "";
                                        	self.listObj.uiObj.flagArray[self.focusPose].innerHTML = self.tempch.playback ? "<img src='images/tv_page/timeshift_focus.png'/>":"";
                                            break;
                                        }
                                    case 1:
                                        break;
                                }
                                return false;
                            case KEY_UP:
                                //数据采集
                                if (groupListObj.listObj.getItem().name == "常看频道") {
                                    changeTvMode = "39";
                                } else {
                                    changeTvMode = "29";
                                }
                                switch (self.area) {
                                    case 0:
                                        self.listObj.up();
                                        break;
                                    case 1:
                                        var tempItems = self.listObj.getItems();
                                        var tempIndex = self.listObj.getIndex();
                                        var newIndex = tempIndex - 1;
                                        newIndex = newIndex < 0 ? tempItems.length - 1 : newIndex;
                                        if (!tempItems[newIndex].playback) {
                                            self.area = 0;
                                        }
                                        self.listObj.setIndex(newIndex);
                                        self.listObj.upDate();
                                        break;
                                }
                                return false;
                            case KEY_DOWN:
                                //数据采集
                                if (groupListObj.listObj.getItem().name == "常看频道") {
                                    changeTvMode = "40";
                                } else {
                                    changeTvMode = "30";
                                }
                                switch (self.area) {
                                    case 0:
                                        self.listObj.down();
                                        break;
                                    case 1:
                                        var tempItems = self.listObj.getItems();
                                        var tempIndex = self.listObj.getIndex();
                                        var newIndex = tempIndex + 1;
                                        newIndex = newIndex >= tempItems.length ? newIndex - tempItems.length : newIndex;
                                        if (!tempItems[newIndex].playback) {
                                            self.area = 0;
                                        }
                                        self.listObj.setIndex(newIndex);
                                        self.listObj.upDate();
                                        break;
                                    default:
                                        break;
                                }
                                return false;
                            case KEY_PAGE_DOWN:
                                //数据采集
                                if (groupListObj.listObj.getItem().name == "常看频道") {
                                    changeTvMode = "42";
                                } else {
                                    changeTvMode = "32";
                                }
                                self.area = 0;
                                self.listObj.pageDown();
                                return false;
                            case KEY_PAGE_UP:
                                //数据采集
                                if (groupListObj.listObj.getItem().name == "常看频道") {
                                    changeTvMode = "41";
                                } else {
                                    changeTvMode = "31";
                                }
                                self.area = 0;
                                self.listObj.pageUp();
                                return false;
                            case KEY_ENTER:
                                switch (self.area) {
                                    case 0:
                                    case 1:
                                        self.listObj.select();
                                        break;
                                    default:
                                        break;
                                }
                                return false;
                            case KEY_BACK:
                            case KEY_EXIT:
                            	self.area=0;
                            	if(self.listObj.getFocusPos() == 0){
                            	  self.listObj.forceGetEpg = true;
                            	}
                                self.setStyleLostFocus(self.listObj.getFocusPos(), "left");
                                self.loseFocus();
                                groupListObj.getFocus();
                                return false;
                            default:
                                return true;
                        }
                    };
                    this.getFocus = function(obj) {
                        this.focus = 1;
                        this.forceGetEpg = true;
                        SumaJS.debug("channelListObjEvent getFocus obj = " + JSON.stringify(obj));
                        SumaJS.eventManager.addEventListener("channelListObjEvent", this, 90);
                        SumaJS.$("#tv_page_channel_name_list1").style.display = "block";
                        this.listObj.uiObj.focusBg.style.display = "block";
                        if (typeof obj == "number" || typeof obj == "string") {
                            switch (groupListObj.listObj.getItem().name) { //根据分组列表的选择来获取频道列表数据
                                case "常看频道":
                                    showOftenWatchService(obj);
                                    break;
                                default:
                                    var services = groupListObj.listObj.getItem().services;
                                    this.listObj.resetData({ index: parseInt(obj), items: services });
                                    break;
                            }
                            if (typeof obj == "string") {
                                this.area = 1;
                                this.listObj.upDate();
                            }
                        }
                        //数据采集
                        if (groupListObj.listObj.getItem().name == "常看频道") { //进入第一个台，按照下键上报
                            changeTvMode = "40";
                            //如果当前焦点是常看设置时
                            if (this.listObj.getIndex() == this.listObj.getItems().length - 1) {
                                this.listObj.uiObj.focusBg.style.display = "none";
                                this.showTipFocus(this.listObj.getFocusPos());
                            }
                        } else { //进入第一个台，按照下键上报
                            changeTvMode = "30";
                        }

                    };
                    this.loseFocus = function() {
                        this.focus = 0;
                        SumaJS.eventManager.removeEventListener("channelListObjEvent");
                        this.listObj.resetData({ index: 0, items: [] });
                        epgListObj.clear(); //清空epg列表
                        self.listObj.uiObj.allUI.style.display = "none";
                        self.listObj.uiObj.focusBg.style.display = "none";
                        this.hideTip(); //隐藏常看设置
                    };
                    this.clear = function() { //清空显示

                    };
                };

				
                setting_model = -1; //0:选择，1：排序, 2:删除
                setPanelObj = new function() { //常看设置面板
                    this.focus = 0;
                    var self = this;
                    this.colorArr = ["#E6E5B3", "#E1E1E1"]; //颜色数组，第一个为非选中颜色，第二个为选中颜色
                    var cfg = {
                        items: [{ name: "选择" }, { name: "排序" }, { name: "删除" }],
                        type: 1,
                        pageSize: 3,
                        uiObj: {
                            allUI: SumaJS.$("#setting_menu_panel"),
                            nameArray: SumaJS.$("#setting_menu_panel .setting_menu"),
                            focusBg: SumaJS.$("#setting_focus")
                        },
                        showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                            if (!subItems) {
                                for (var i = 0; i < uiObj.nameArray.length; ++i) {
                                    uiObj.nameArray[i].innerHTML = "&nbsp;";
                                }
                            } else {
                                if (isUpdate) {
                                    for (var i = 0; i < this.pageSize; ++i) {
                                        if (subItems[i]) {
                                            uiObj.nameArray[i].style.color = self.colorArr[0];
                                            uiObj.nameArray[i].innerHTML = subItems[i].name;
                                        } else {
                                            uiObj.nameArray[i].innerHTML = "";
                                        }
                                    }
                                } else if (lastFocusPos > -1) {
                                    uiObj.nameArray[lastFocusPos].style.color = self.colorArr[0];
                                    uiObj.nameArray[lastFocusPos].style.fontSize = FONT_NUM_3;
                                }
                                if (focusPos > -1) {
                                    uiObj.focusBg.style.top = -55 + focusPos * 46 + "px";
                                    uiObj.nameArray[focusPos].style.color = self.colorArr[1];
                                    uiObj.nameArray[focusPos].style.fontSize = FONT_NUM_2;
                                }
                            }
                        },
                        onSelect: function() {

                        }
                    };
                    this.listObj = new SubList(cfg);
                    this.initial = function() {
                        //this.getFocus();
                        this.listObj.resetData({ index: 0 });

                    };
                    this.eventHandler = function(event) {
                        var keyCode = event.keyCode || event.which;
                        SumaJS.debug("tv_page setPanelObj keyCode = " + keyCode);
                        switch (keyCode) {
                            case KEY_LEFT:
                                return false;
                            case KEY_RIGHT:
                                return false;
                            case KEY_UP:
                                self.listObj.up();
                                return false;
                            case KEY_DOWN:
                                self.listObj.down(); //up
                                return false;
                            case KEY_ENTER:
                                var thisIndex = self.listObj.getIndex();
                                if (thisIndex == 0) { //选择
                                    setting_model = 0;
                                    oftenSetListObj.listObj.resetData({ index: 0, items: allServices });
                                } else if (thisIndex == 1) { //排序
                                    setting_model = 1;
                                    SumaJS.debug("userServices = " + JSON.stringify(userServices));
                                    oftenSetListObj.listObj.resetData({ index: 0, items: userServices });
                                    //oftenSetListObj.listObj.resetData({index:0,items:oftenWatchServices.slice(0,-1)});     
                                } else if (thisIndex == 2) { //删除
                                    setting_model = 2;
                                    SumaJS.debug("userServices = " + JSON.stringify(userServices));
                                    oftenSetListObj.listObj.resetData({ index: 0, items: userServices });
                                }
                                SumaJS.$("#tv_page_channel_name_list1").style.display = "none";
                                this.loseFocus();
                                oftenSetListObj.getFocus();
                                return false;
                            case KEY_BACK:
                            case KEY_EXIT:
                                this.loseFocus();
                                channelListObj.listObj.uiObj.focusBg.style.display = "block";
                                channelListObj.getFocus();
                                return false;
                            default:
                                return true;
                        }
                    };
                    this.getFocus = function() {
                        this.focus = 1;
                        SumaJS.eventManager.addEventListener("PanelEventHandler", this, 85);
                        var currentFocusPos = channelListObj.listObj.getFocusPos();
                        this.listObj.uiObj.allUI.style.top = (currentFocusPos * 47 - 40) + "px";
                        this.listObj.uiObj.allUI.style.display = "block";
                        this.listObj.uiObj.focusBg.style.visibility = "visible";
                    };
                    this.loseFocus = function() {
                        this.focus = 0;
                        SumaJS.eventManager.removeEventListener("PanelEventHandler");
                        this.listObj.uiObj.allUI.style.display = "none";
                    };
                };

                oftenSetListObj = new function() { //常看设置列表
                    var tempSetList = [];
                    this.focus = 0;
                    var self = this;
                    this.area = 0; //0:频道区域，1：回看按钮区域。
                    this.colorArr = ["#A9B4C4", "#D8DBE0", "#BCC1A3", "#D8DBE0", "#415477"];
                    //0-选择(未选中), 1-选择(选中), 2-排序(未选中), 3-排序(选中), 4-排序(确定键后)， 2-删除（未选中），3-删除（选中）
                    this.orderChoose = false; //排序选中标志位
                    this.orderIndex = 0;
                    this.sliderDom = SumaJS.$("#set_list_cursor_slider"); //右侧的滑条
                    var prcSic = portalAd.channelEidt();//设置中的海报
                    if (prcSic) {
                    	SumaJS.$('#set_list_ad').src = prcSic;	
                    }
                    var cfg = {
                        items: [],
                        type: 2,
                        delayTime: 200,
                        pageSize: 8,
                        uiObj: {
                            allUI: SumaJS.$("#tv_page_channel_name_list2"),
                            nameArray: SumaJS.$("#tv_page_channel_name_list2 .set_channelname"),
                            iconArray: SumaJS.$("#tv_page_channel_name_list2 .set_choose_icon"),
                            focusBg: SumaJS.$("#tv_page_channel_name_list2 .focus")[0] //选中焦点框
                        },
                        showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                            if (!subItems) {
                                for (var i = 0; i < uiObj.kandianArray.length; ++i) {
                                    uiObj.nameArray[i].innerHTML = "&nbsp;";
                                    uiObj.iconArray[i].innerHTML = "&nbsp;";
                                }
                                uiObj.focusBg.style.display = "none";
                            } else {
                                SumaJS.debug("@@@isUpdate=" + isUpdate + "   lastFocusPos=" + lastFocusPos + "   focusPos=" + focusPos + "  this.pageSize=" + this.pageSize);
                                if (setting_model == 0) { //选择
                                    if (isUpdate) {
                                        for (var i = 0; i < this.pageSize; ++i) {
                                            if (subItems[i]) {
                                                var service = subItems[i];
                                                uiObj.nameArray[i].innerHTML = service.serviceName;
                                                uiObj.iconArray[i].innerHTML = isUserServices(service) ? "<img src='images/often_watch/check_box_checked.png'/>" : "<img src='images/often_watch/check_box_unchecked.png'/>";
                                                uiObj.nameArray[i].style.color = self.colorArr[0];
                                            } else {
                                                uiObj.nameArray[i].innerHTML = "";
                                                uiObj.iconArray[i].innerHTML = "";
                                            }
                                        }
                                        uiObj.focusBg.style.display = "none";
                                    }
                                    if (lastFocusPos > -1) {
                                        self.lostStyle(lastFocusPos);
                                        var service = subItems[lastFocusPos];
                                        uiObj.iconArray[lastFocusPos].innerHTML = isUserServices(service) ? "<img src='images/often_watch/check_box_checked.png'/>" : "<img src='images/often_watch/check_box_unchecked.png'/>";
                                    }
                                    if (focusPos > -1) {
                                        self.setStyleOnFocus(focusPos);
                                        var service = subItems[focusPos];
                                        uiObj.iconArray[focusPos].innerHTML = isUserServices(service) ? "<img src='images/often_watch/check_box_checked_focus.png'/>" : "<img src='images/often_watch/check_box_unchecked_focus.png'/>";
                                    }

                                } else if (setting_model == 1) { //排序
                                    if (isUpdate) {
                                        uiObj.focusBg.style.display = "block";
                                        uiObj.focusBg.style.backgroundImage = "url(images/often_watch/often_order_focus.png)";
                                        //uiObj.focusBg.innerHTML = "<img src='images/often_watch/often_order_focus.png'/>";
                                        for (var i = 0; i < this.pageSize; ++i) {
                                            if (subItems[i]) {
                                                var service = subItems[i];
                                                uiObj.nameArray[i].innerHTML = service.serviceName;
                                                uiObj.nameArray[i].style.color = self.colorArr[2];
                                                if (self.orderChoose) {
                                                    uiObj.iconArray[i].innerHTML = "";
                                                } else {
                                                    uiObj.iconArray[i].innerHTML = "<img src='images/often_watch/order_icon.png'/>";
                                                }
                                            } else {
                                                uiObj.nameArray[i].innerHTML = "";
                                                uiObj.iconArray[i].innerHTML = "";
                                            }
                                        }
                                        //uiObj.focusBg.innerHTML = self.orderChoose ? "<img src='images/often_watch/often_order_move.png'/>" : "<img src='images/often_watch/often_order_focus.png'/>";
                                        uiObj.focusBg.style.backgroundImage = self.orderChoose ? "url(images/often_watch/often_order_move.png)" : "url(images/often_watch/often_order_focus.png)";
                                    }
                                    if (lastFocusPos > -1) {
                                        self.lostStyle(lastFocusPos);
                                        var service = subItems[lastFocusPos];
                                        uiObj.nameArray[lastFocusPos].innerHTML = service.serviceName;
                                        if (self.orderChoose) {
                                            uiObj.iconArray[lastFocusPos].innerHTML = "";
                                        } else {
                                            uiObj.iconArray[lastFocusPos].innerHTML = "<img src='images/often_watch/order_icon.png'/>";
                                        }
                                    }
                                    if (focusPos > -1) {
                                        self.setStyleOnFocus(focusPos);
                                        var service = subItems[focusPos];
                                        uiObj.nameArray[focusPos].innerHTML = displayText(service.serviceName, 175, 22);
                                        uiObj.focusBg.style.top = 38 + 47 * focusPos + "px";
                                        if (self.orderChoose) {
                                            uiObj.nameArray[focusPos].style.color = self.colorArr[4];
                                            uiObj.iconArray[focusPos].innerHTML = "确认";
                                            uiObj.iconArray[focusPos].style.color = self.colorArr[4];
                                        } else {
                                            uiObj.iconArray[focusPos].innerHTML = "排序";
                                            uiObj.iconArray[focusPos].style.color = self.colorArr[3];
                                        }
                                    }

                                } else if (setting_model == 2) { //删除   
                                    if (isUpdate) {
                                        for (var i = 0; i < this.pageSize; ++i) {
                                            if (subItems[i]) {
                                                var service = subItems[i];
                                                uiObj.nameArray[i].innerHTML = service.serviceName;
                                                uiObj.nameArray[i].style.color = self.colorArr[2];
                                                if (tempSetList.length > 0) {
                                                    var bloo = true;
                                                    for (var j = 0; j < tempSetList.length; j++) {
                                                        if (tempSetList[j].serviceHandle == service.serviceHandle) {
                                                            bloo = false;
                                                            break;
                                                        }
                                                    }
                                                    if (!bloo) {
                                                        uiObj.iconArray[i].innerHTML = "<img src='images/often_watch/check_box_unchecked.png'/>";
                                                    } else {
                                                        uiObj.iconArray[i].innerHTML = "<img src='images/often_watch/check_box_checked.png'/>";
                                                    }
                                                } else {
                                                    uiObj.iconArray[i].innerHTML = "<img src='images/often_watch/check_box_checked.png'/>";
                                                }
                                                // uiObj.iconArray[i].innerHTML =  isUserServices(service)? "<img src='images/often_watch/check_box_checked.png'/>" : "<img src='images/often_watch/check_box_unchecked.png'/>";
                                            } else {
                                                uiObj.nameArray[i].innerHTML = "";
                                                uiObj.iconArray[i].innerHTML = "";
                                            }
                                        }
                                        //uiObj.focusBg.innerHTML = self.orderChoose ? "<img src='images/often_watch/often_order_move.png'/>" : "<img src='images/often_watch/often_order_focus.png'/>";
                                        uiObj.focusBg.style.display = "none";
                                    }
                                    if (lastFocusPos > -1) {
                                        self.lostStyle(lastFocusPos);
                                        var service = subItems[lastFocusPos];
                                        uiObj.nameArray[lastFocusPos].innerHTML = service.serviceName;
                                        if (tempSetList.length > 0) {
                                            var bloo = true;
                                            for (var i = 0; i < tempSetList.length; i++) {
                                                if (tempSetList[i].serviceHandle == service.serviceHandle) {
                                                    bloo = false;
                                                    break;
                                                }
                                            }
                                            if (!bloo) {
                                                uiObj.iconArray[lastFocusPos].innerHTML = "<img src='images/often_watch/check_box_unchecked.png'/>";
                                            } else {
                                                uiObj.iconArray[lastFocusPos].innerHTML = "<img src='images/often_watch/check_box_checked.png'/>";
                                            }
                                        } else {
                                            uiObj.iconArray[lastFocusPos].innerHTML = "<img src='images/often_watch/check_box_checked.png'/>";
                                        }
                                        // uiObj.iconArray[lastFocusPos].innerHTML =  isUserServices(service)? "<img src='images/often_watch/check_box_checked.png'/>" : "<img src='images/often_watch/check_box_unchecked.png'/>";
                                    }
                                    if (focusPos > -1) {
                                        self.setStyleOnFocus(focusPos);
                                        var service = subItems[focusPos];
                                        if (tempSetList.length > 0) {
                                            var bloo = true;
                                            for (var i = 0; i < tempSetList.length; i++) {
                                                if (tempSetList[i].serviceHandle == service.serviceHandle) {
                                                    bloo = false;
                                                    break;
                                                }
                                            }
                                            if (!bloo) {
                                                uiObj.iconArray[focusPos].innerHTML = "<img src='images/often_watch/check_box_unchecked_focus.png'/>";
                                            } else {
                                                uiObj.iconArray[focusPos].innerHTML = "<img src='images/often_watch/check_box_checked_focus.png'/>";
                                            }
                                        } else {
                                            uiObj.iconArray[focusPos].innerHTML = "<img src='images/often_watch/check_box_checked_focus.png'/>";
                                        }
                                        // uiObj.iconArray[focusPos].innerHTML =  isUserServices(service)? "<img src='images/often_watch/check_box_checked_focus.png'/>" : "<img src='images/often_watch/check_box_unchecked_focus.png'/>";
                                    }

                                }
                                var thisIndex = this.getIndex(); //右侧滑动条的显示
                                self.showSlider(thisIndex);
                            }

                        },
                        onSelect: function(item) {

                        }
                    };
                    this.listObj = new SubList(cfg);
                    this.showSlider = function(pos) { //显示进度条
                        var len = self.listObj.getItems().length;
                        //self.sliderDom.style.top = 14+pos/len*450+"px";
                        self.sliderDom.style.top = 14 + pos / (len - 1) * 442 + "px";
                    };
                    this.initial = function() {
                        //this.listObj.resetData({index:0,items:allServices});
                    };
                    this.eventHandler = function(event) {
                        var keyCode = event.keyCode || event.which;
                        SumaJS.debug("tv_page oftenSetListObj keyCode = " + keyCode);
                        switch (keyCode) {
                            case KEY_LEFT:
                                return false;
                            case KEY_RIGHT:
                                return false;
                            case KEY_UP:
                                var tempItems = self.listObj.getItems();
                                var tempIndex = self.listObj.getIndex();
                                if (setting_model == 0) {
                                    self.listObj.up();
                                } else if (setting_model == 1) {
                                    if (self.orderChoose) {
                                        var upIndex = tempIndex - 1 < 0 ? tempItems.length - 1 : tempIndex - 1;
                                        var ch = tempItems.splice(tempIndex, 1);
                                        tempItems.splice(upIndex, 0, ch[0]);
                                        self.listObj.resetData({ index: upIndex, items: tempItems });
                                    } else {
                                        self.listObj.up();
                                    }
                                } else if (setting_model == 2) {
                                    self.listObj.up();
                                }
                                return false;
                            case KEY_DOWN:
                                var tempItems = self.listObj.getItems();
                                var tempIndex = self.listObj.getIndex();
                                if (setting_model == 0) {
                                    self.listObj.down();
                                } else if (setting_model == 1) {
                                    if (self.orderChoose) {
                                        var downIndex = tempIndex + 1 < tempItems.length ? tempIndex + 1 : 0;
                                        var ch = tempItems.splice(tempIndex, 1);
                                        tempItems.splice(downIndex, 0, ch[0]);
                                        self.listObj.resetData({ index: downIndex, items: tempItems });
                                    } else {
                                        self.listObj.down();
                                    }
                                } else if (setting_model == 2) {
                                    self.listObj.down();
                                }
                                return false;
                            case KEY_PAGE_UP:
                                self.listObj.pageUp();
                                return false;
                            case KEY_PAGE_DOWN:
                                self.listObj.pageDown();
                                return false;
                            case KEY_ENTER:
                                var thisService = self.listObj.getItem();
                                var thisFocusPos = self.listObj.getFocusPos();
                                if (setting_model == 0) { //选择                               
                                    if (isUserServices(thisService)) {
                                        deleteFromUserService(thisService);
                                        self.listObj.uiObj.iconArray[thisFocusPos].innerHTML = "<img src='images/often_watch/check_box_unchecked_focus.png'/>";
                                        //alert(JSON.stringify(userServices));
                                    } else {
                                        if (userServices.length >= 20) {
                                            showGlobalMsgBox("您可以设置的常看频道已满,请先删除部分频道后再添加");
                                        } else {
                                            addToUserService(thisService);
                                            self.listObj.uiObj.iconArray[thisFocusPos].innerHTML = "<img src='images/often_watch/check_box_checked_focus.png'/>";
                                            //alert(JSON.stringify(userServices));
                                        }
                                    }
                                } else if (setting_model == 1) { //排序
                                    var thisFocus = self.listObj.getFocusPos();
                                    if (self.orderChoose) {
                                        self.orderChoose = false;
                                        self.showIcons();
                                        self.listObj.uiObj.focusBg.style.backgroundImage = "url(images/often_watch/often_order_focus.png)";
                                        self.listObj.uiObj.nameArray[thisFocus].style.color = self.colorArr[3];
                                        self.listObj.upDate();
                                    } else {
                                        self.orderChoose = true;
                                        self.hideIcons();
                                        self.listObj.uiObj.iconArray[thisFocus].innerHTML = "确认";
                                        self.listObj.uiObj.iconArray[thisFocus].style.color = self.colorArr[4];
                                        self.listObj.uiObj.focusBg.style.backgroundImage = "url(images/often_watch/often_order_move.png)";
                                        self.listObj.uiObj.nameArray[thisFocus].style.color = self.colorArr[4];
                                        //self.listObj.upDate();
                                    }
                                } else if (setting_model == 2) { //删除
                                    if (tempSetList.length > 0) {
                                        var bloo = true;
                                        for (var i = 0; i < tempSetList.length; i++) {
                                            if (tempSetList[i].serviceHandle == thisService.serviceHandle) {
                                                bloo = false;
                                                break;
                                            }
                                        }
                                        if (bloo) {
                                            tempSetList.push(thisService);
                                            self.listObj.uiObj.iconArray[thisFocusPos].innerHTML = "<img src='images/often_watch/check_box_unchecked_focus.png'/>";
                                        } else {
                                            tempSetList.splice(i, 1);
                                            self.listObj.uiObj.iconArray[thisFocusPos].innerHTML = "<img src='images/often_watch/check_box_checked_focus.png'/>";
                                        }
                                    } else {
                                        tempSetList.push(thisService);
                                        self.listObj.uiObj.iconArray[thisFocusPos].innerHTML = "<img src='images/often_watch/check_box_unchecked_focus.png'/>";
                                    }
                                }
                                return false;
                            case KEY_BACK: //保存修改的设置。
                                if (setting_model == 0) {
                                    SumaJS.debug("save userServices = " + userServices);
                                    oftenWatchObj.modifyToJson(userServices); //保存到本地
                                    showOftenWatchService();
                                    oftenWatchObj.sendModifyByAjax(userServices); //保存到本地								
                                } else if (setting_model == 1) {
                                    var currItems = self.listObj.getItems();
                                    oftenWatchObj.modifyToJson(currItems); //保存到本地						
                                    showOftenWatchService();
                                    oftenWatchObj.sendModifyByAjax(userServices); //保存到本地
                                } else if (setting_model == 2) {
                                    if (tempSetList.length == userServices.length) {
                                        userServices = [];
                                    } else {
                                        for (var i = 0; i < tempSetList.length; i++) {
                                            for (var j = 0; j < userServices.length; j++) {
                                                if (tempSetList[i].serviceHandle == userServices[j].serviceHandle) {
                                                    userServices.splice(j, 1);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    tempSetList = [];
                                    oftenWatchObj.modifyToJson(userServices);
                                    showOftenWatchService();
                                    oftenWatchObj.sendModifyByAjax(userServices); //保存到本地
                                }
                                this.loseFocus();
                                channelListObj.getFocus();
                                return false;
                            case KEY_EXIT:
                                this.loseFocus();
                                channelListObj.getFocus();
                                return false;
                            default:
                                return true;
                        }
                    };
                    this.setStyleOnFocus = function(pos) { //获焦时样式设置
                        if (setting_model == 0) {
                            self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[1];
                        } else {
                            self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[3];
                        }
                        self.listObj.uiObj.nameArray[pos].style.fontSize = FONT_NUM_2;
                        self.listObj.uiObj.nameArray[pos].style.fontWeight = "bold";
                    };
                    this.lostStyle = function(pos) { //失焦时样式变化
                        if (setting_model == 0) {
                            self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[0];
                        } else {
                            self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[2];
                        }
                        self.listObj.uiObj.nameArray[pos].style.fontSize = FONT_NUM_3;
                        self.listObj.uiObj.nameArray[pos].style.fontWeight = "normal";
                    };
                    this.hideIcons = function() { //排序时，确定键隐藏箭头
                        for (var i = 0; i < self.listObj.pageSize; i++) {
                            self.listObj.uiObj.iconArray[i].innerHTML = "";
                        }
                    };
                    this.showIcons = function() { //排序时确定键后显示箭头
                        var itemsArr = self.listObj.getItems();
                        for (var i = 0; i < self.listObj.pageSize; i++) {
                            if (itemsArr[i]) { //防止个数小于pageSize时，下面会显示的箭头较多
                                self.listObj.uiObj.iconArray[i].innerHTML = "<img src='images/often_watch/order_icon.png'/>";
                            }
                        }
                    };
                    this.getFocus = function() {
                        this.focus = 1;
                        SumaJS.eventManager.addEventListener("oftenSetListObj", this, 80);
                        channelListObj.lastIndex = -1; //置频道列表的该属性为-1，防止回到频道列表不播放问题
                        this.listObj.uiObj.allUI.style.display = "block";
                        if (setting_model == 0) {
                            this.listObj.uiObj.focusBg.style.display = "none";
                        } else if (setting_model == 1) {
                            this.listObj.uiObj.focusBg.style.display = "block";
                        }

                    };
                    this.loseFocus = function() {
                        this.focus = 0;
                        this.orderChoose = false;
                        setting_model = -1;
                        SumaJS.eventManager.removeEventListener("oftenSetListObj");
                        this.listObj.uiObj.allUI.style.display = "none";
                        this.listObj.uiObj.focusBg.style.display = "none";

                        this.lostStyle(self.listObj.getFocusPos()); //失焦点时样式变化
                        this.listObj.resetData({ index: 0 }); //失去焦点时清空					
                    };
                };

                tvOftenData = new function() { //用来处理直播页面的常看数据
                    this.isOftenWatchService = function(service) { //用来判断是否是常看频道
                        if (!service) { return false; }
                        for (var i = 0; i < oftenWatchServices.length; i++) {
                            if (service.serviceHandle == oftenWatchServices[i].serviceHandle) {
                                return true;
                            }
                        }
                        return false;
                    };
                    this.isUserServices = function(service) { //用来判断是否是用户自设的常看频道
                        if (!service) { return false; }
                        for (var i = 0; i < userServices.length; i++) {
                            if (service.serviceHandle == userServices[i].serviceHandle) {
                                return true;
                            }
                        }
                        return false;
                    };
                    this.isRecServices = function(service) { //用来判断是否是系统推荐的常看频道
                        if (!service) { return false; }
                        for (var i = 0; i < recServices.length; i++) {
                            if (service.serviceHandle == recServices[i].serviceHandle) {
                                return true;
                            }
                        }
                        return false;
                    };
                    this.deleteFromUserService = function(service) { //从用户自设常看频道中删除
                        if (!service) { return false; }
                        for (var i = 0; i < userServices.length; i++) {
                            if (service.serviceHandle == userServices[i].serviceHandle) {
                                userServices.splice(i, 1); //从数组中移除该项
                            }
                        }
                    };
                    this.addToUserService = function(service) { //添加到用户自设常看频道数组
                        if (!service) { return false; }
                        userServices.push(service);
                    };
                };

                clearPanelObj = new function() { //常看清理面板
                    this.focus = 0;
                    var self = this;
                    this.colorArr = ["#D2DCE6", "#FFFFFF"]; //颜色数组，第一个为非选中颜色，第二个为选中颜色
                    var cfg = {
                        items: [{ name: "选择" }, { name: "排序" }, { name: "删除" }],
                        type: 1,
                        pageSize: 3,
                        uiObj: {
                            allUI: SumaJS.$("#setting_menu_panel"),
                            nameArray: SumaJS.$("#setting_menu_panel .setting_menu"),
                            focusBg: SumaJS.$("#setting_focus")
                        },
                        showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                            if (!subItems) {
                                for (var i = 0; i < uiObj.nameArray.length; ++i) {
                                    uiObj.nameArray[i].innerHTML = "&nbsp;";
                                }
                            } else {
                                if (isUpdate) {
                                    for (var i = 0; i < this.pageSize; ++i) {
                                        if (subItems[i]) {
                                            uiObj.nameArray[i].innerHTML = subItems[i].name;
                                        } else {
                                            uiObj.nameArray[i].innerHTML = "";
                                        }
                                    }
                                } else if (lastFocusPos > -1) {

                                }
                                if (focusPos > -1) {

                                }
                            }
                        },
                        onSelect: function() {

                        }
                    };
                    this.listObj = new SubList(cfg);
                    this.initial = function() {
                        //this.listObj.resetData({index:0});

                    };
                    this.eventHandler = function(event) {
                        var keyCode = event.keyCode || event.which;
                        SumaJS.debug("tv_page clearPanelObj keyCode = " + keyCode);
                        switch (keyCode) {
                            case KEY_UP:
                                self.listObj.up();
                                return false;
                            case KEY_DOWN:
                                self.listObj.up();
                                return false;
                            case KEY_ENTER:
                                this.loseFocus();
                                oftenSetListObj.getFocus();
                                return false;
                            case KEY_BACK:
                            case KEY_EXIT:
                                this.loseFocus();
                                channelListObj.listObj.uiObj.focusBg.style.display = "block";
                                channelListObj.getFocus();
                                return false;
                            default:
                                return true;
                        }
                    };
                    this.getFocus = function() {
                        this.focus = 1;
                        SumaJS.eventManager.addEventListener("clearPanelObj", this, 85);
                        var currentFocusPos = channelListObj.listObj.getFocusPos();
                        this.listObj.uiObj.allUI.style.top = (32 + currentFocusPos * 46 - 95) + "px";
                        this.listObj.uiObj.allUI.style.display = "block";
                        this.listObj.uiObj.focusBg.style.visibility = "visible";
                    };
                    this.loseFocus = function() {
                        this.focus = 0;
                        SumaJS.eventManager.removeEventListener("clearPanelObj");
                        this.listObj.uiObj.allUI.style.display = "none";
                    };
                };
                allChannelObj = new function() { //全部频道对象
                    this.focus = 0;
                    this.nowIndex = -1;
                    this.area = 0; //区域
                    var self = this;
                    this.colorArr = ["#d2dce6", "#ffffff"]; //颜色数组，第一个为非选中颜色，第二个为选中颜色
                    this.curPageNum = -1; //当前页
                    this.specialData = {};
                    this.flipPointArray = [];
                    this.flipPointFocus = -1; //当前小点位置
                    var cfg = {
                        items: [],
                        type: 1,
                        pageSize: 27,
                        uiObj: {
                            allUI: SumaJS.$("#tv_page_channel_name_list3"),
                            //flipPointArray: SumaJS.$("#tv_page_channel_name_list3 .flip_point"),  //右侧小点
                            focusBg: SumaJS.$("#tv_page_channel_name_list3 .focus")[0],
                            numArray: SumaJS.$("#tv_page_channel_name_list3 .ch_num"),
                            nameArray: SumaJS.$("#tv_page_channel_name_list3 .ch_name"),
                            rightarrowArray: SumaJS.$("#tv_page_channel_name_list3 .ch_right"),
                            flagArray: SumaJS.$("#tv_page_channel_name_list3 .ch_flag")
                                //pageNum: SumaJS.$("#tv_page_channel_name_list2_left_focus")
                        },
                        showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                            if (!subItems) {
                                for (var i = 0; i < uiObj.numArray.length; ++i) {
                                    uiObj.numArray[i].innerHTML = "&nbsp;";
                                    uiObj.nameArray[i].innerHTML = "&nbsp;";
                                    uiObj.flagArray[i].innerHTML = "";
                                    uiObj.rightarrowArray[i].style.display = "none";
                                }
                                uiObj.focusBg.style.display = "none";
                            } else {
                                SumaJS.debug("@@@isUpdate=" + isUpdate + "   lastFocusPos=" + lastFocusPos + "   focusPos=" + focusPos + "  this.pageSize=" + this.pageSize);
                                if (isUpdate) {
                                    //uiObj.pageNum.style.top = 27 + (this.menuDataAccessObj.getPageIndexByName()-1)*33 +"px";
                                    //uiObj.pageNum.innerHTML = this.menuDataAccessObj.getPageIndexByName();
                                    for (var i = 0; i < uiObj.numArray.length; ++i) {
                                        uiObj.numArray[i].style.color = self.colorArr[0];
                                        uiObj.nameArray[i].style.color = self.colorArr[0];
                                        uiObj.rightarrowArray[i].style.display = "none";
                                        if (subItems[i]) {
                                            uiObj.numArray[i].innerHTML = subItems[i].logicalChannelId;
                                            uiObj.nameArray[i].innerHTML = subItems[i].serviceName;
                                            uiObj.flagArray[i].innerHTML = subItems[i].playback ? "<img src='images/tv_page/timeshift_small.png'/>" : "";
                                        } else {
                                            uiObj.numArray[i].innerHTML = "";
                                            uiObj.nameArray[i].innerHTML = "";
                                            uiObj.flagArray[i].innerHTML = "";
                                        }
                                    }
                                }
                                if (lastFocusPos > -1) {

                                    self.lostStyle(lastFocusPos);
                                    uiObj.rightarrowArray[lastFocusPos].style.display = "none";

                                    if (subItems[lastFocusPos]) {
                                        uiObj.nameArray[lastFocusPos].innerHTML = subItems[lastFocusPos].serviceName;
                                        if (subItems[lastFocusPos].playback) {
                                            uiObj.flagArray[lastFocusPos].innerHTML = "<img src='images/tv_page/timeshift_small.png'/>";
                                        } else {
                                            uiObj.flagArray[lastFocusPos].innerHTML = "";
                                        }
                                    }

                                }
                                if (focusPos > -1) {

                                    uiObj.nameArray[focusPos].innerHTML = subItems[focusPos].serviceName;

                                    self.setStyleOnFocus(focusPos);

                                    if (self.area == 0) {
                                        uiObj.focusBg.style.display = "block";
                                        //uiObj.focusBg.style.top = 34+47*(focusPos%9)+"px";
                                        uiObj.focusBg.style.top = 33 + 47 * (focusPos % 9) + "px";
                                        uiObj.focusBg.style.left = 27 + 240 * parseInt(focusPos / 9) + "px";

                                        uiObj.nameArray[focusPos].innerHTML = displayText(subItems[focusPos].serviceName, 100, 20);
                                        //uiObj.nameArray[focusPos].innerHTML = subItems[focusPos].serviceName;

                                        if (subItems[focusPos].playback) {
                                            uiObj.flagArray[focusPos].innerHTML = "<img src='images/tv_page/timeshift_big.png'/>";
                                            //uiObj.flagArray[focusPos].style.left = "130px";
                                            uiObj.flagArray[focusPos].style.left = "132px";
                                            uiObj.rightarrowArray[focusPos].style.display = "block";
                                        } else {
                                            uiObj.flagArray[focusPos].innerHTML = "";
                                            uiObj.rightarrowArray[focusPos].style.display = "none";
                                        }

                                    } else {
                                        uiObj.focusBg.style.display = "none";
                                        uiObj.rightarrowArray[focusPos].style.display = "none";
                                        if (subItems[focusPos].playback) {
                                            uiObj.flagArray[focusPos].innerHTML = "<img src='images/tv_page/timeshift_focus.png'/>";
                                            //uiObj.flagArray[focusPos].style.left = "130px";
                                            uiObj.flagArray[focusPos].style.left = "132px";
                                        } else {
                                            uiObj.flagArray[focusPos].innerHTML = "";
                                        }

                                    }
                                }
                            }

                            self.curPageNum = parseInt(this.getIndex() / this.pageSize); //初始化当前页号
                            if (self.flipPointFocus == -1 || self.curPageNum != self.flipPointFocus) {
                                self.showFlipPoint(self.curPageNum);
                            }


                            //播放该service
                            var mtime = (new Date()).getTime();
                            var delayTime = 200;
                            if (mtime - lastPlayTime < 800) {
                                delayTime = 800;
                            }
                            lastPlayTime = mtime;
                            var tempCh = this.getItem();

                            /*
                            if(!currentService || currentService.serviceType == 2 || currentService.channelId != tempCh.channelId){  //防止左右键移动时切台
                            	playCurrentService(tempCh,delayTime);
                            }else if(self.cycleFlag){  //异常闭环回来需要播放
                            	playCurrentService(tempCh,delayTime);
                            	self.cycleFlag = false; 
                            }
                            */
                            if (tempCh && self.nowIndex != this.getIndex()) { //索引有变化则调用播放接口
                                playCurrentService(tempCh, delayTime);
                                self.nowIndex = this.getIndex();
                            }

                        },
                        onSelect: function(item) {
                            var thisIndex = this.getIndex();
                            if (self.area == 0) {
                                //数据采集
                                changeTvMode = "46";

                                closeCycleControl.setNode("tv_page", [groupListObj.listObj.getIndex() + "a", thisIndex], "AllChannel");
                                closeCycleControl.pushNodeToStack();
                                OffChannelObj.saveOffChannelToM(item);
                                OffChannelObj.saveOffChannel(item);
                                SumaJS.loadModule("play_tv");
                            } else if (self.area == 1) {
                                closeCycleControl.setNode("tv_page", [groupListObj.listObj.getIndex() + "a", thisIndex + "a"], "AllChannel");
                                closeCycleControl.pushNodeToStack();
                                closeCycleControl.saveStack();
                                var thisChannelId = item.channelId;
                                jumpPathInitialization("/NewFrameWork/UE/html/backlist.html?channelId=" + thisChannelId);
                            }
                        }
                    };
                    this.listObj = new SubList(cfg);
                    this.initial = function() {
                        SumaJS.debug("tv_page allChannelObj initial entered");
                    };
                    this.lostStyle = function(pos) { //失焦时样式变化
                        self.listObj.uiObj.numArray[pos].style.color = self.colorArr[0];
                        self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[0];
                        self.listObj.uiObj.numArray[pos].style.fontSize = FONT_NUM_4;
                        self.listObj.uiObj.nameArray[pos].style.fontSize = FONT_NUM_4;
                        self.listObj.uiObj.numArray[pos].style.left = "0px";
                        self.listObj.uiObj.nameArray[pos].style.left = "40px";
                        self.listObj.uiObj.flagArray[pos].style.left = "100px";
                    };
                    this.setStyleOnFocus = function(pos) { //获焦时样式设置
                        self.listObj.uiObj.numArray[pos].style.fontSize = FONT_NUM_3;
                        self.listObj.uiObj.nameArray[pos].style.fontSize = FONT_NUM_3;
                        self.listObj.uiObj.numArray[pos].style.color = self.colorArr[1];
                        self.listObj.uiObj.nameArray[pos].style.color = self.colorArr[1];

                        //self.listObj.uiObj.numArray[pos].style.left = "-15px";
                        //self.listObj.uiObj.nameArray[pos].style.left = "25px";

                        self.listObj.uiObj.numArray[pos].style.left = "-7px";
                        self.listObj.uiObj.nameArray[pos].style.left = "35px";
                    };
                    this.eventHandler = function(event) {
                        var keyCode = event.keyCode || event.which;
                        var thisItems = self.listObj.getItems();
                        var nowIndex = self.listObj.getIndex(); //当前焦点索引
                        var nowPos = self.listObj.getFocusPos(); //当前焦点位置
                        var heightNum = 9; //高度为9个
                        var thisPageSize = 27; //总个数
                        SumaJS.debug("tv_page allChannelObj keyCode = " + keyCode);
                        switch (keyCode) {
                            case KEY_LEFT:
                                //数据采集,由于不会重复播放，所以不会重复上报
                                changeTvMode = "35";

                                if (self.area == 0) {
                                    if (self.listObj.getFocusPos() < heightNum) { //当前焦点位置小于9								
                                        this.loseFocus();
                                        groupListObj.getFocus();
                                    } else {
                                        var nextIndex = nowIndex - heightNum;
                                        if (thisItems[nextIndex].playback) {
                                            self.area = 1;
                                        }
                                        self.listObj.setIndex(nextIndex);
                                        self.listObj.upDate();
                                    }
                                } else {
                                    self.area = 0;
                                    self.listObj.upDate();
                                }
                                return false;
                            case KEY_RIGHT:
                                //数据采集,由于不会重复播放，所以不会重复上报
                                changeTvMode = "36";
                                if (self.area == 0) {
                                    if (self.listObj.getItems()[nowIndex].playback) {
                                        self.area = 1;
                                        self.listObj.upDate();
                                    } else {
                                        if (nowIndex % thisPageSize >= 2 * heightNum) { //判断是否是最后一列
                                            return false;
                                        }
                                        var nextIndex = nowIndex + heightNum > this.specialData["totalNumber"] - 1 ? nowIndex : nowIndex + heightNum;
                                        self.listObj.setIndex(nextIndex);
                                        self.listObj.upDate();
                                    }
                                } else {
                                    if (nowIndex % thisPageSize >= 2 * heightNum) { //判断是否是最后一列
                                        return false;
                                    }
                                    self.area = 0;
                                    var nextIndex = nowIndex + heightNum > this.specialData["totalNumber"] - 1 ? nowIndex : nowIndex + heightNum;
                                    self.listObj.setIndex(nextIndex);
                                    self.listObj.upDate();
                                }
                                return false;
                            case KEY_UP:
                                //数据采集,由于不会重复播放，所以不会重复上报
                                changeTvMode = "33";
                                if (self.area == 0) {
                                    var nextIndex = self.getUpIndex(nowIndex);
                                    self.listObj.setIndex(nextIndex);
                                    self.listObj.upDate();
                                } else {
                                    var nextIndex = self.getUpIndex(nowIndex);
                                    if (!thisItems[nextIndex].playback) { //如果要移动到的地方没有回看，设area为0
                                        self.area = 0;
                                    }
                                    self.listObj.setIndex(nextIndex);
                                    self.listObj.upDate();
                                }
                                return false;
                            case KEY_DOWN:
                                //数据采集,由于不会重复播放，所以不会重复上报
                                changeTvMode = "34";
                                if (self.area == 0) {
                                    var nextIndex = self.getDownIndex(nowIndex);
                                    self.listObj.setIndex(nextIndex);
                                    self.listObj.upDate();
                                } else {
                                    var nextIndex = self.getDownIndex(nowIndex);
                                    if (!thisItems[nextIndex].playback) { //如果要移动到的地方没有回看，设area为0
                                        self.area = 0;
                                    }
                                    self.listObj.setIndex(nextIndex);
                                    self.listObj.upDate();
                                }
                                return false;
                            case KEY_PAGE_UP:
                                //数据采集,由于不会重复播放，所以不会重复上报
                                changeTvMode = "37";
                                if (this.curPageNum != 0) {
                                    self.area = 0;
                                    self.listObj.pageUp();
                                }
                                return false;
                            case KEY_PAGE_DOWN:
                                //数据采集,由于不会重复播放，所以不会重复上报
                                changeTvMode = "38";
                                self.area = 0;
                                self.listObj.pageDown();
                                return false;
                            case KEY_ENTER:
                                self.listObj.select();
                                return false;
                            case KEY_BACK:
                            case KEY_EXIT:
                                self.loseFocus();
                                groupListObj.getFocus();
                                return false;
                            default:
                                return true;
                        }
                    };
                    this.getUpIndex = function(thisIndex) { //获得上面的index
                        var heightNum = 9;
                        if (thisIndex % heightNum != 0) { //不是第一行                                
                            return thisIndex - 1;
                        } else { //是第一行
                            if (self.curPageNum != 0) { //不是首页
                                return (thisIndex - heightNum * 2 - 1);
                            } else { //是首页第一行
                                switch (this.specialData["remainColumeNumber"]) { //最后一页列数
                                    case 1:
                                        return this.specialData["totalNumber"] - 1;
                                        break;
                                    case 2:
                                        if (thisIndex == 0) {
                                            return this.specialData["totalNumber"] - this.specialData["remainRowNumber"] - 1;
                                        } else if (thisIndex == heightNum) {
                                            return this.specialData["totalNumber"] - 1;
                                        } else {
                                            return this.specialData["totalNumber"] - 1;
                                        }
                                        break;
                                    case 3:
                                        if (thisIndex == 0) {
                                            return this.specialData["totalNumber"] - this.specialData["remainNumber"] - 1 + heightNum;
                                        } else if (thisIndex == heightNum) {
                                            return this.specialData["totalNumber"] - this.specialData["remainNumber"] - 1 + heightNum * 2;
                                        } else {
                                            return this.specialData["totalNumber"] - 1;
                                        }
                                        break;
                                    default: //异常情况
                                        return 0;
                                        break;
                                }
                            }
                        }
                    };
                    this.getDownIndex = function(thisIndex) {
                        var heightNum = 9;
                        var thisPageSize = 27;
                        if (thisIndex == this.specialData["totalNumber"] - 1) { //是最后一个
                            if (thisIndex % self.listObj.pageSize >= 18) {
                                return 2 * heightNum;
                            } else if (thisIndex % self.listObj.pageSize >= 9) {
                                return heightNum;
                            } else {
                                return 0;
                            }
                        }
                        if (thisIndex % heightNum != heightNum - 1) { //不是最后一行                                 
                            return thisIndex + 1;
                        } else { //是最后一行
                            if (self.curPageNum == this.specialData["totalPageNum"] - 1) { //最后一页	
                                var gap = thisIndex - (this.specialData["totalPageNum"] - 1) * self.listObj.pageSize;
                                if (gap > 9) {
                                    return heightNum;
                                } else {
                                    return 0;
                                }
                            } else if (self.curPageNum == this.specialData["totalPageNum"] - 2) { //倒数第二页
                                if (thisIndex % thisPageSize > this.specialData["remainNumber"]) {
                                    return (this.specialData["totalNumber"] - 1);
                                } else {
                                    return (thisIndex + heightNum * 2 + 1);
                                }
                            } else { //其他页
                                return (thisIndex + heightNum * 2 + 1);
                            }
                        }
                    };
                    this.initialSpecialData = function(dataArr) {
                        this.specialData = {};
                        //var totalNumber = this.listObj.getItems().length; 	
                        var totalNumber = dataArr.length;
                        var totalPageNum = totalNumber != 0 ? parseInt(totalNumber / this.listObj.pageSize) + 1 : 0; //总页数
                        var remainNumber = totalNumber % this.listObj.pageSize; //最后一页剩余个数
                        var remainColumeNumber = parseInt(remainNumber / 9) + 1; //最后一页列数
                        var remainRowNumber = remainNumber % 9; //最后一列剩余个数

                        this.specialData["totalNumber"] = totalNumber;
                        this.specialData["totalPageNum"] = totalPageNum;
                        this.specialData["remainNumber"] = remainNumber;
                        this.specialData["remainColumeNumber"] = remainColumeNumber;
                        this.specialData["remainRowNumber"] = remainRowNumber;
                    };
                    this.initialFlipPointArray = function() { //初始化小亮点个数。
                        var arr = SumaJS.$("#tv_page_channel_name_list3 .flip_point"); //右侧小点
                        var len = this.specialData["totalPageNum"];
                        for (var i = 0; i < len; i++) {
                            this.flipPointArray[i] = arr[i];
                        }
                        for (var i = 0; i < this.flipPointArray.length; i++) {
                            this.flipPointArray[i].style.display = "block";
                        }
                    };
                    this.showFlipPoint = function(num) { //显示小亮点
                        for (var i = 0; i < self.flipPointArray.length; i++) {
                            self.flipPointArray[i].innerHTML = "<img src='images/tv_page/flip_point_black.png'/>";
                        }
                        self.flipPointArray[parseInt(num)].innerHTML = "<img src='images/tv_page/flip_point_bright.png'/>";
                        self.flipPointFocus = num;
                    };
                    this.getFocus = function(obj) {
                        //进入全部频道，播放第一个台，按下键上报
                        changeTvMode = "34";
                        this.focus = 1;
                        SumaJS.eventManager.addEventListener("allChannelObjEvent", this, 90);
                        self.listObj.uiObj.allUI.style.display = "block";
                        self.listObj.uiObj.focusBg.style.display = "block";
                        var dataArr = allServices;
                        this.initialSpecialData(dataArr); //全部频道获焦点后初始化一些特殊数据。
                        this.initialFlipPointArray();
                        //this.listObj.resetData({index:0, items:dataArr});
                        switch (typeof obj) {
                            case "number": //频道名称获焦
                                this.listObj.resetData({ index: obj, items: dataArr });
                                this.listObj.upDate();
                                return false;
                            case "string": //时移标志获焦
                                this.listObj.resetData({ index: parseInt(obj), items: dataArr });
                                if (this.listObj.getItem().playback) {
                                    self.area = 1;
                                } else {
                                    self.area = 0;
                                }
                                this.listObj.upDate();
                                return false;
                            case "undefined":
                                this.listObj.resetData({ index: 0, items: dataArr });
                                this.listObj.upDate();
                                return false;
                            default:
                                this.listObj.resetData({ index: 0, items: dataArr });
                                return false;
                        }
                    };
                    this.loseFocus = function() {
                        this.focus = 0;
                        SumaJS.eventManager.removeEventListener("allChannelObjEvent");
                        self.listObj.uiObj.allUI.style.display = "none";
                        self.listObj.uiObj.focusBg.style.display = "none";
                        self.lostStyle(self.listObj.getFocusPos());
                    };
                };
           		channelListObj.initial();
				setPanelObj.initial(); //初始化常看设置面板
            }
            var oftenWatchServices = []; //常看频道数组
            var userServices = [];
            var recServices = [];
            var oftenWatchHash = [];
			var epgListObj = new function() { //epg列表对象(不获焦)
                    var self = this;
                    var cfg = {
                        items: [],
                        type: 1,
                        // pageSize: 3,
                        pageSize: 8,
                        uiObj: {
                            timeArray: SumaJS.$("#tv_page_epg .epg_event_time"),
                            typeArray: SumaJS.$("#tv_page_epg .epg_event_type"),
                            nameArray: SumaJS.$("#tv_page_epg .epg_event_name")
                        },
                        showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                            SumaJS.debug("epgListObj.listObj showData entered");
                            if (!subItems) {
                                for (var i = 0; i < this.pageSize; ++i) {
                                    uiObj.timeArray[i].innerHTML = "";
                                    uiObj.typeArray[i].innerHTML = "";
                                    uiObj.nameArray[i].innerHTML = "";
                                }
                            } else {
                                if (isUpdate) {
                                    for (var i = 0; i < this.pageSize; ++i) {
                                        if (subItems[i]) {
                                            uiObj.timeArray[i].innerHTML = subItems[i].startTime ? subItems[i].startTime : "";
                                            uiObj.typeArray[i].innerHTML = subItems[i].contentType ? subItems[i].contentType : "";
                                            uiObj.nameArray[i].innerHTML = subItems[i].eventName ? adapterEventName(subItems[i].eventName) : "";
                                        } else {
                                            uiObj.timeArray[i].innerHTML = "";
                                            uiObj.typeArray[i].innerHTML = "";
                                            uiObj.nameArray[i].innerHTML = "";
                                        }
                                    }
                                } else if (lastFocusPos > -1) {

                                }
                                if (focusPos > -1) {

                                }
                            }
                        }
                    };
                    this.listObj = new SubList(cfg);
                    this.nowObj = new function() {
                        var uiObj = {
                            timeDom: SumaJS.$("#tv_page_epg_now_time"),
                            typeDom: SumaJS.$("#tv_page_epg_now_type"),
                            nameDom: SumaJS.$("#tv_page_epg_now_name"),
                            progressDom: SumaJS.$("#tv_page_epg_progress"),
                        };
                        this.resetData = function(data) {
                            if (data) {
                                uiObj.timeDom.innerHTML = typeof(data.startTime) != "undefined" ? data.startTime : "";
                                uiObj.typeDom.innerHTML = typeof(data.contentType) != "undefined" ? data.contentType : "";
                                uiObj.nameDom.innerHTML = typeof(data.eventName) != "undefined" ? adapterEventName(data.eventName) : "";
                                var prop = self.caculateProp(data);
                                uiObj.progressDom.style.width = 315 * prop + "px";
                            } else {
                                uiObj.timeDom.innerHTML = "";
                                uiObj.typeDom.innerHTML = "";
                                uiObj.nameDom.innerHTML = "";
                                uiObj.progressDom.style.width = "0px";
                            }
                        };
                    };
                    this.caculateProp = function(data) { //比例计算
                        if (typeof data != "object") { return 0; }
                        var date1 = ("" + data.startDate).split("-");
                        var date2 = ("" + data.startTime).split(":");
                        var startTimeTmp = new Date(date1[0], date1[1] - 1, date1[2], date2[0], date2[1], date2[2]);
                        var startTime = startTimeTmp.getTime();
                        var dd = new Date();
                        var nowDateTime = dd.getTime();
                        SumaJS.debug("epgListObj.listObj caculateProp startDate = " + data.startDate);
                        SumaJS.debug("epgListObj.listObj caculateProp startTime = " + startTime);
                        SumaJS.debug("epgListObj.listObj caculateProp nowDateTime = " + nowDateTime);
                        SumaJS.debug("epgListObj.listObj caculateProp dvbEvent.duration = " + data.duration);
                        var ret = (nowDateTime - startTime) / 1000 / parseInt(data.duration);
                        if (ret > 1) {
                            ret = 1;
                        }
                        SumaJS.debug("epgListObj.listObj caculateProp ans = " + ret);
                        return ret;
                    };

                    function adapterEventName(nameStr) {
                        var reg = /^[a-zA-Z0-9]$/;
                        if (nameStr) {
                            var cont = 0;
                            var retStr = "";
                            for (var i = 0; i < nameStr.length; i++) {
                                if (reg.test(nameStr[i])) {
                                    cont += 1;
                                } else {
                                    cont += 2;
                                }
                                retStr += nameStr[i];
                                if (cont > 16) {
                                    return retStr + "...";
                                }
                            }
                            return retStr;
                        }
                        return nameStr;
                    }
                    this.clear = function() { //清空epg列表显示
                        for (var i = 0; i < this.listObj.pageSize; ++i) {
                            this.listObj.uiObj.timeArray[i].innerHTML = "";
                            this.listObj.uiObj.typeArray[i].innerHTML = "";
                            this.listObj.uiObj.nameArray[i].innerHTML = "";
                        }
                        this.nowObj.resetData();
                    };
                    this.showStartGetEpgTip = function() {
                        epgListObj.nowObj.resetData({ startTime: "正在加载..." });
                    }
                };
				
            function showOftenWatchService(obj) { //显示常看频道列表			
                oftenWatchServices = [];
                userServices = [];
                recServices = [];
                SumaJS.debug("showOftenWatchService entered");
                oftenWatchObj.getRecChannels(); //获取系统推送的常看频道				
                oftenWatchObj.getUserChannelsByJson(); //读取json文件获取用户自设频道。

                var userChannels = oftenWatchObj.getUserArray();
                var recChannels = oftenWatchObj.getRecArray();
                SumaJS.debug("showOftenWatchService userChannels = " + userChannels);
                SumaJS.debug("showOftenWatchService recChannels = " + recChannels);


                for (var i = 0; i < userChannels.length; i++) {
                    for (var j = 0; j < allServices.length; j++) {
                        if (parseInt(userChannels[i].ChannelId) == parseInt(allServices[j].channelId)) {
                            userServices.push(allServices[j]);
                            break;
                        }
                    }
                }
                for (var i = 0; i < recChannels.length; i++) {
                    for (var j = 0; j < allServices.length; j++) {
                        if (parseInt(recChannels[i].ChannelId) == parseInt(allServices[j].channelId)) {
                            recServices.push(allServices[j]);
                            break;
                        }
                    }
                }
                oftenWatchServices = oftenWatchObj.concatUserAndRecChannels(userServices, recServices);
                SumaJS.debug("showOftenWatchService oftenWatchServices = " + oftenWatchServices);
                oftenWatchServices.push({ "serviceName": "##001" }); //常看设置菜单项代号添加到常看频道列表的末尾
                SumaJS.debug("showOftenWatchService oftenWatchServices = " + oftenWatchServices);
                switch (typeof obj) {
                    case "number": //频道名称获焦
                        channelListObj.area = 0;
                        if (oftenWatchServices.length > parseInt(obj)) {
                            channelListObj.listObj.resetData({ index: parseInt(obj), items: oftenWatchServices });
                        } else {
                            channelListObj.listObj.resetData({ index: 0, items: oftenWatchServices });
                        }
                        return false;
                    case "string": //时移标志获焦
                        channelListObj.area = 1;
                        if (oftenWatchServices.length > parseInt(obj)) {
                            channelListObj.listObj.resetData({ index: parseInt(obj), items: oftenWatchServices });
                        } else {
                            channelListObj.listObj.resetData({ index: 0, items: oftenWatchServices });
                        }
                        return false;
                    case "undefined":
                        channelListObj.listObj.resetData({ index: 0, items: oftenWatchServices });
                        channelListObj.getFocus();
                        return false;
                    default:
                        return false;
                }
            }


            function isOftenWatchService(service) { //用来判断是否是常看频道
                if (!service) { return false; }
                for (var i = 0; i < oftenWatchServices.length; i++) {
                    if (service.serviceHandle == oftenWatchServices[i].serviceHandle) {
                        return true;
                    }
                }
                return false;
            }

            function isUserServices(service) { //用来判断是否是用户自设的常看频道
                if (!service) { return false; }
                for (var i = 0; i < userServices.length; i++) {
                    if (service.serviceHandle == userServices[i].serviceHandle) {
                        return true;
                    }
                }
                return false;
            }

            function isRecServices(service) { //用来判断是否是系统推荐的常看频道
                if (!service) { return false; }
                for (var i = 0; i < recServices.length; i++) {
                    if (service.serviceHandle == recServices[i].serviceHandle) {
                        return true;
                    }
                }
                return false;
            }

            function deleteFromUserService(service) { //从用户自设常看频道中删除
                if (!service) { return false; }
                for (var i = 0; i < userServices.length; i++) {
                    if (service.serviceHandle == userServices[i].serviceHandle) {
                        userServices.splice(i, 1); //从数组中移除该项
                    }
                }
            }

            function addToUserService(service) { //添加到用户自设常看频道数组
                if (!service) { return false; }
                //userServices.push(service);
                userServices.unshift(service);
            };



            var cfg = {
                onSearchSuccess: function(array, mask) {
                    SumaJS.debug("chanlist_epg onSearchSuccess array.length=" + array.length + " mask=" + mask + " playTimer=" + playTimer);
                    if (!mask || mask == 0x02 && playTimer != -1) {
                        PFInfo.endGetPF(array);
                    }
                },
                onSearchTimeout: null,
                onSearchExceedMaxCount: null
            };
            cfg.onSearchExceedMaxCount = cfg.onSearchSuccess;
            cfg.onSearchTimeout = cfg.onSearchSuccess;
            var chanlist_epg = new EPGControl(cfg);
            SumaJS.eventManager.addEventListener("chanlist_epg", chanlist_epg, 55);
            var PFInfo = {
                clearTime: 2,
                retryCount: 0,
                epgControl: null,
                service: null,
                overTimeFlag: false,
                overTimer: null,
                init: function(epgv) {
                    this.epgControl = epgv;
                },
                reset: function() {
                    this.retryCount = 0;
                },
                startGetPF: function(service) {
                    this.retryCount++;
                    this.service = service;
                    this.epgControl.searchByService(this.service, 0x02, 20); //epg需要显示数据大于2条，
                    var self = this;
                    clearTimeout(self.overTimer);
                    //epgListObj.nowObj.resetData({startTime:"正在获取epg信息..."});
                    //epgListObj.listObj.resetData({items: []});
                    this.overTimeFlag = false;
                    this.overTimer = setTimeout(function() {
                        self.overTimeFlag = true;
                        self.showPF([{ startTime: "加载节目超时..." }]);
                    }, 20000);
                },
                endGetPF: function(array) {
                    if (this.overTimeFlag) {
                        return;
                    }
                    if (this.retryCount >= this.clearTime) {
                        this.showPF(array);
                    } else {
                        if (!array) {
                            this.startGetPF(this.service);
                        } else {
                            this.showPF(array);
                        }
                    }
                },
                showPF: function(array) { //显示epg信息
                    clearTimeout(this.overTimer);
                    this.retryCount = 0;
                    if (!array) { return; }
                    var num = epgListObj.listObj.pageSize; //epg列表个数
                    switch (array.length) {
                        case 0:
                            SumaJS.debug("tv_page PFInfo showPF array = 0");
                            epgListObj.nowObj.resetData({ startTime: "暂无节目信息" });
                            break;
                        case 1:
                            SumaJS.debug("tv_page PFInfo showPF array = 1");
                            epgListObj.nowObj.resetData(array[0]);
                            break;
                        default:
                            SumaJS.debug("tv_page PFInfo showPF array > 1");
                            epgListObj.nowObj.resetData(array[0]);
                            var newArr = array.slice(1, num + 1);
                            SumaJS.debug("tv_page PFInfo showPF newArr.length = " + newArr.length);
                            epgListObj.listObj.resetData({ items: newArr });
                            break;
                    }
                }
            };
            PFInfo.init(chanlist_epg);
            /*var PFInfoRecommendMgr = new function() {
                var self = this;
                var defaultImg = "images/tv_page/recommend_default.png";

                function makeurl(regionCode, channelID) {
                    var url = UBAServerAdd + "/uba-online-zsbtv/1.0/json/getViewingAspectsByChannelID?regionCode=" + regionCode + "&channelID=" + channelID;
                    return url;
                }

                function parseInfo(info) {
                    var ret = null;
                    var programs = info.programs;
                    if (programs) {
                        var title = programs[0].itemName;
                        var content = programs[0].summarMedium;
                        var poster = programs[0].poster;
                        ret = { t: title, c: content, p: poster };
                    }
                    return ret;
                }

                function adapterContent(str) {
                    if (str.length > 13 * 3) {
                        return str.substring(0, 13 * 3) + "......";
                    } else {
                        return str;
                    }
                }

                function setInfo(p, t, c) {
                    SumaJS.getDom("tv_page_epg_recommend_img").src = p;
                    SumaJS.getDom("tv_page_epg_recommend_img").onerror = function() {
                        this.src = defaultImg;
                    };
                    SumaJS.getDom("tv_page_epg_recommend_title").innerHTML = t;
                    SumaJS.getDom("tv_page_epg_recommend_content").innerHTML = adapterContent(c);
                }
                this.startGetInfo = function(curService) {
                    if (!curService) {
                        SumaJS.debug("PFInfoRecommendMgr startGetInfo but curService=" + curService);
                        return false;
                    } else {
                        var ajaxParam = {
                            url: makeurl(CA.regionCode, curService.channelId),
                            method: "GET",
                            data: "",
                            success: function(data) {
                                if (!data) { return; }
                                var str = data.responseText;
                                var dataObj = null;
                                try {
                                    dataObj = JSON.parse(str);
                                    var info = parseInfo(dataObj);
                                    if (info) {
                                        setInfo(info.p, info.t, info.c);
                                    } else {
                                        setInfo(defaultImg, "无推荐信息", "");
                                    }
                                } catch (e) {
                                    setInfo(defaultImg, "无推荐信息", "");
                                }
                            },
                            failed: function(data) {
                                setInfo(defaultImg, "无推荐信息", "");
                            }
                        };
                        SumaJS.ajax(ajaxParam);
                    }
                }
            };*/

            var volumebar;
            function initialVolumebar() { //初始化 volumebar
                var uiObj = {
                    volumebar: SumaJS.getDom("tv_page_volume_bar"),
                    volumeProgress: SumaJS.getDom("tv_page_volume_bar_progress"),
                    volumeValue: SumaJS.getDom("tv_page_volume_bar_num"),
                    mute: SumaJS.getDom("tv_page_volume_mute")
                };
                var cfg = {
                    minVolume: 0,
                    maxVolume: 32,
                    uiObj: uiObj,
                    player: SumaJS.globalPlayer.mediaPlayer,
                    onUIAdapter: function(dataObj, uiObj) {
                        if (typeof dataObj.mute != "undefined" && dataObj.mute == 1) {
                            uiObj.mute.style.display = "block";
                        } else if (typeof dataObj.mute != "undefined" && dataObj.mute == 0) {
                            uiObj.mute.style.display = "none";
                        }
                        if (dataObj.showFlag) {
                            uiObj.volumeValue.innerHTML = dataObj.value;
                            var width = 24 * dataObj.value;
                            uiObj.volumeProgress.style.width = width + "px";
                            uiObj.volumebar.style.display = "block";
                            this.focus = 1;
                        } else {
                            uiObj.volumebar.style.display = "none";
                            this.focus = 0;
                        }
                    },
                    onEventHandler: function(event) {
                        SumaJS.debug("tv_page volume entered focus = " + this.focus);
                        if (this.focus) {
                            var val = event.keyCode || event.which;
                            SumaJS.debug("tv_page volume keyCode = " + val);
                            switch (val) {
                                case KEY_VOLUME_UP:
                                    this.volumeUp(currentService);
                                    break;
                                case KEY_VOLUME_DOWN:
                                    this.volumeDown(currentService);
                                    break;
                                case KEY_MUTE:
                                    this.muteFunc();
                                    break;
                                case KEY_EXIT:
                                case KEY_UP:
                                case KEY_DOWN:
                                case KEY_LEFT:
                                case KEY_RIGHT:
                                    this.hide();
                                    return true;
                                    break;
                                case KEY_ENTER:
                                    this.hide();
                                    return true;
                                    break;
                                default:
                                    return true;
                                    break;
                            }
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
                volumebar = new VolumeBar(cfg);
                volumebar.setFocusState(0);
                //SumaJS.eventManager.addEventListener("volumebar", volumebar, 98);
            }

           /* var chanNumObj = { //数字键控制
                focus: 0,
                inputStr: "",
                currentNum: 0,
                uiObj: SumaJS.getDom("chanlist_tv_channel_number"),
                hideTimer: -1,
                hideTime: 5000,
                input: function(num) {
                    var htmlStr = "";
                    var len = this.inputStr.length;
                    if (len < 3) {
                        this.inputStr = this.inputStr + num.toString();
                        len++;
                    }
                    for (var i = 0; i < 3 - len; i++) {
                        htmlStr += "<img src='images/num/" + 0 + ".png' style='visibility:hidden;'/>";
                    }
                    for (var i = 0; i < len; i++) {
                        htmlStr += "<img src='images/num/" + this.inputStr[i] + ".png' />";
                    }
                    this.uiObj.innerHTML = htmlStr;
                    this.show();
                },
                resetNum: function(num) {
                    this.inputStr = "";
                    var temp = parseInt(num, 10);
                    this.currentNum = temp;
                    var currStr = SumaJS.padString(this.currentNum, "0", 3);
                    var htmlStr = "";
                    for (var i = 0; i < 3; i++) {
                        htmlStr += "<img src='images/num/" + currStr[i] + ".png' />";
                    }
                    this.uiObj.innerHTML = htmlStr;
                    this.show();
                },
                show: function() {
                    this.setFocusState(1);
                    this.uiObj.style.display = "block";
                    clearTimeout(this.hideTimer);
                    if (this.inputStr.length == 3) {
                        this.hideTime = 200;
                    } else if (this.inputStr.length >= 1) {
                        this.hideTime = 1500;
                    } else {
                        this.hideTime = 5000;
                    }
                    this.hideTimer = setTimeout(function() {
                        chanNumObj.hidden();
                    }, chanNumObj.hideTime);
                },
                hidden: function() {
                    clearTimeout(this.hideTimer);
                    this.uiObj.style.display = "none";
                    var channelIndex = this.inputStr;
                    this.inputStr = "";
                    if (channelIndex) {
                        //playServiceById(channelIndex);
                    }
                },
                selected: function() {
                    if (this.inputStr.length > 0) {
                        clearTimeout(this.hideTimer);
                        //playServiceById(this.inputStr);
                        this.inputStr = "";
                        return false;
                    } else {
                        return true;
                    }
                },
                setFocusState: function(state) {
                    this.focus = state;
                },
                eventHandler: function(event) {
                    var val = event.keyCode || event.which;
                    SumaJS.debug("====chanlist tv get msg=== which[" + val + "]");
                    if (!this.focus) {
                        return true;
                    }
                   	alert(1);
                    switch (val) {
                        case KEY_ENTER:
                            return this.selected();
                            break;
                        case KEY_NUM0:
                        case KEY_NUM1:
                        case KEY_NUM2:
                        case KEY_NUM3:
                        case KEY_NUM4:
                        case KEY_NUM5:
                        case KEY_NUM6:
                        case KEY_NUM7:
                        case KEY_NUM8:
                        case KEY_NUM9:
                            this.input(val - 48);
                            break;
                        default:
                            return true;
                            break;
                    }
                }
            }; */

           /* function playServiceById(id) { //根据输入的数字播放
                if	 (!parseInt(id, 10)) {
                    return;
                }
                var id = SumaJS.padString(id, "0", 3);
                var tempGroupIndex = -1;
                var tempIndex = -1;
                var services = null;
                //本组查找
                var currItems = epgChannelList.getItems();
                for (var i = 0, len = currItems.length; i < len; i++) {
                    if (currItems[i].logicalChannelId == id) {
                        tempIndex = i;
                        tempGroupIndex = self.listObj.index;
                        services = serviceInfo[tempGroupIndex].services[tempIndex];
                        break;
                    }
                }
                if (tempIndex == -1) { //本分组没有找到，继续找其他分组
                    var tempInfos = null;
                    if (chanNumObj.hideTime != 5000) {
                        tempInfos = SumaJS.globalServiceInfo;
                    } else {
                        tempInfos = serviceInfo;
                    }
                    var datas = tempInfos || [];
                    var flag = false;
                    for (var i = 0, len = datas.length; i < len; i++) {
                        var tempServices = datas[i].services;
                        for (var j = 0, size = tempServices.length; j < size; j++) {
                            if (tempServices[j].logicalChannelId == id) {
                                tempGroupIndex = i;
                                tempIndex = j;
                                flag = true;
                                services = datas[tempGroupIndex].services[tempIndex];
                                break;
                            }
                        }
                        if (flag) {
                            break;
                        }
                    }
                }
                if (tempIndex == -1) {
                    showPlayTipMsgBox("对应频道不存在");
                    setTimeout(function() { SumaJS.msgBox.removeMsg("play_tip_box"); }, 2000);
                    return;
                }
                if (chanNumObj.hideTime != 5000) {
                    if (currentService && currentService.logicalChannelId != services.logicalChannelId) {
                        SumaJS.stopPlayer(1);
                        currentService = null;
                    }
                    var playParam = {
                        serviceInfo: {
                            TSID: services.tsInfo.TsId,
                            serviceID: services.serviceId
                        }
                    }
                    changeTvMode = "03";
                    SumaJS.loadModule("play_tv", JSON.stringify(playParam));
                    return;
                }
                self.listObj.index = tempGroupIndex;
                self.listObj.showData();
                epgChannelList.resetData({ index: tempIndex, items: serviceInfo[tempGroupIndex].services });
                chanNumObj.show();
                playCurrentService(services);
            }*/
            function refreshAd() { //刷新广告
                ADContrl.showAD("epg");
                ADContrl.epgData0 = null;
                ADContrl.epgData1 = null;
                if (currentService) {
                    ADContrl.refreshADByService(currentService.networkId, currentService.tsInfo.TsId, currentService.serviceId);
                } else {
                    ADContrl.refreshADByService(0, 0, 0);
                }
                ADContrl.switchEpgImg();
                setTimeout(refreshAd, 120000);
            }

            function setMediaplayer(type) { //设置播放器模式和位置
                if (SumaJS.globalPlayer && type == 2) {
                    SumaJS.globalPlayer.setFocusState(1);
                    setTimeout(function() { SumaJS.globalPlayer.setVideoDisplayArea("0, 40, 162, 386, 280"); }, 10);
                } else if (!SumaJS.globalPlayer && type == 1) {
                    SumaJS.createPlayer();
                    if (thisPageName != "tv_page") {
                        //创建播放器时需要重新播放
                        if (smallHomeVideo.getIsPlayingNvod()) {
                            var nvodObj = smallHomeVideo.getNvodObj();
                            smallHomeVideo.playNvod(nvodObj);
                        } else {
                            playCurrentServices(currentService);
                        }
                    }
                }
            }

            function showPlayTipMsgBox(msg) {
                var retCfg = {
                    name: "play_tip_box",
                    priority: 13,
                    boxCss: "info",
                    titleObj: {
                        title: "",
                        style: "title"
                    },
                    msgObj: {
                        msg: msg,
                        css: "msg_box1"
                    },
                    eventHandler: function(event) {
                        if (this.focus && event.source != 1001) {
                            var val = event.keyCode || event.which;
                            switch (val) {
                                case KEY_ENTER:
                                    this.removeMsg("play_tip_box");
                                    break;
                                default:
                                    break;
                            }
                            return true;
                        } else {
                            return true;
                        }
                    }
                };
                SumaJS.showMsgBox(retCfg);
            }


            function toTimeShift(service) { //进入时移 
                if (!service) {
                    return;
                }
                if (service.playback) {
                    var trackSeq = 0;

                    if (service.audioArray instanceof Array && service.audioArray.length > 0) {
                        for (var i = 0; i < service.audioArray.length; i++) {
                            if (service.audioArray[i].AudioPid == playingAudioPid) {
                                trackSeq = i;
                                break;
                            }
                        }
                    }
                    SysSetting.setEnv("TRACKS_SEQ", trackSeq);
                    var url = PORTAL_ADDR + "/NewFrameWork/web/timePlayer.html?channelId=" + service.channelId;
                    SysSetting.setEnv("PAGEFOCUSINDEX", "play_tv");
                    SumaJS.getDom("chanlist_bg").style.display = "none";
                    SumaJS.globalPlayer.setVideoDisplayArea("1, 0, 0, 0, 0");
                    enterTimeShift = true;
                    window.location.href = url;
                } else {
                    showPlayTipMsgBox("不是时移频道,如需观看时移频道，请选择带<img src='images/icon/timeshift_2.png' />标识的频道");
                    setTimeout(function() { SumaJS.msgBox.removeMsg("play_tip_box"); }, 2000);
                }
            }

            var pause1Flag = false;
            var lastPlayTime = 0; //上次播放时间（单位毫秒）
            var dcTimerHandle = null; //用于数据采集
            function getEPGandRecommend() { //获取首页二级菜单右侧的EPG和推荐
                if (chanlist_epg) {
                    PFInfo.reset();
                    PFInfo.startGetPF(currentService);
                    clearInterval(epgTimer);
                    epgTimer = setInterval(function() {
                        PFInfo.reset();
                        PFInfo.startGetPF(currentService);
                    }, 60000);
                }
                //PFInfoRecommendMgr.startGetInfo(currentService);
            }

            function playCurrentService(service, delayTime) {
                SumaJS.debug("tv_page playCurrentService " + service.serviceName);
                clearTimeout(playTimer);
                if (!service) {
                    SumaJS.globalPlayer.pause(0);
                    currentService = null;
                    return;
                }
                if (service.serviceType == 2) {
                    audio_bg.show();
                } else {
                    audio_bg.hide();
                }

                //前面板显示
                if (service.serviceType == 2) {
                    StbFrontPanel.displayText("A" + service.logicalChannelId);
                } else {
                    StbFrontPanel.displayText("C" + service.logicalChannelId);
                }
                
                if (playCAMsg) { SumaJS.globalPlayer.pause(0); }
                if (pause1Flag) {
                    if (service.serviceType == 2) {
                        SumaJS.globalPlayer.pause(0);
                    } else {
                        SumaJS.globalPlayer.pause(1);
                    }
                } else {
                    pause1Flag = true;
                }

                if (typeof delayTime == "undefined") {
                    delayTime = 0;
                }
                try{
	                epgListObj.clear(); //清空epg列表
	                epgListObj.showStartGetEpgTip();
                }catch(e){}
                
                clearTimeout(dcTimerHandle);
                dcTimerHandle = setTimeout(function() {
                    if (changeTvMode == "-1") { return; } // 内部定义  -1表示不上报
                    DataCollection.collectData(["04", service.channelId + "", service.serviceName, service.serviceId + "", service.networkId + "", service.tsInfo.TsId + "", changeTvMode, playTvStatus]);
                    changeTvMode = "00";
                }, 1500);
                playTimer = setTimeout(function() {
                    SumaJS.debug("tv_page playCurrentService2 " + service.serviceName);
                    playSuccess = false;
                    currentService = service;
                    playTvStatus = "00";
                    smallHomeVideo.setIsPlayingNvod(false); //设置nvod播放标志位为false
                    SumaJS.globalPlayer.playService(currentService);
                    setMediaplayer(2);
                    volumebar.initChannelVolume(currentService);
                    DVB.tune(currentService.tsInfo.Frequency, currentService.tsInfo.SymbolRate, currentService.tsInfo.Modulation);

                    getEPGandRecommend();

                    //OffChannelObj.saveOffChannel(currentService);
                }, delayTime);

                //ADContrl.refreshADByService(service.networkId, service.tsInfo.TsId, service.serviceId);

            }

            function playCurrentServices(service) {
                SumaJS.debug("video_page playCurrentService " + service.serviceName);
                currentService = service;
                smallHomeVideo.setIsPlayingNvod(false); //设置nvod播放标志位为false
                SumaJS.globalPlayer.playService(currentService);
                setMediaplayer(2);
                DVB.tune(currentService.tsInfo.Frequency, currentService.tsInfo.SymbolRate, currentService.tsInfo.Modulation);
                //OffChannelObj.saveOffChannel(currentService);
            }

            var epgCaMsg = {
                eventHandler: function(event) {
                    var val = event.keyCode || event.which;
                    var event_modifer = parseInt(event.modifiers);
                    SumaJS.debug("====playtv CA message === which[" + val + "]");
                    switch (val) {
                        case MSG_DVB_TUNE_SUCCESS: //锁频成功
                            playSuccess = true;
                            document.body.style.background = "transparent";

                            if (currentService) {
                                SumaJS.globalPlayer.playService(currentService);
                            }

                            playTvStatus = "01";
                            smallHomeVideo.hideCover();
                            return false;
                        case MSG_DVB_TUNE_FAILED: //锁频失败
                            playTvStatus = "04";
                            smallHomeVideo.showCover({ msg: "信号中断，请检查网络信号，如需<br />帮助，请拨打客服热线96956" });
                            if (!playSuccess) {
                                document.body.style.background = "#000";
                            }
                            if (!currentService) {
                                return;
                            }
                            return false;
                        case 11701: //
                            playTvStatus = "02";
                            //SumaJS.getDom("ca_tip_msg").innerHTML = "没有购买此节目";
                            //SumaJS.getDom("ca_tip_msg").style.display = "block";                  
                            return false;
                        case 11702: //隐藏不能播放的ca提示
                            document.body.style.background = "transparent";
                            playCAMsg = "";
                            smallHomeVideo.hideCACover();
                            return false;
                        case 11329:
                            if (thisPageName == "tv_page") {
                                freePreviewFlag = false;
                                return false;
                            }
                        case 11330:
                            if (thisPageName == "tv_page") {
                                freePreviewFlag = true;
                                return false;
                            }
                        default:
                            if (val >= 11001 && val <= 11700 && val != 11536 && val != 11537 && val != 11569 && val != 11329 && val != 11330) {
                                if (val == 11506 || val == 11309 || val == 11030 || val == 11304 || (val >= 11331 && val <= 11337)) {
                                    if (val >= 11331 && val <= 11337 && thisPageName == "tv_page") {
                                        freePreviewFlag = false;
                                    }
                                    playTvStatus = "02";
                                    if (channelOrderFlag) {
                                        playCAMsg = "频道未授权，如需订购请咨询当地营业厅或拨打客服热线96956";
                                    } else {
                                        playCAMsg = "频道未授权，如需订购请咨询当地营业厅或拨打客服热线96956";
                                    }
                                } else {
                                    playTvStatus = "03";
                                    playCAMsg = SysSetting.getEventInfo(event_modifer);
                                }
                                smallHomeVideo.showCACover({ msg: playCAMsg });
                                document.body.style.background = "#000";
                                return false;
                            } else if (val >= 11801 && val <= 11900) {
                                if (val == 11814 || val == 11815) {
                                    playTvStatus = "02";
                                    if (channelOrderFlag) {
                                        playCAMsg = "频道未授权，如需订购请咨询当地营业厅或拨打客服热线96956";
                                    } else {
                                        playCAMsg = "频道未授权，如需订购请咨询当地营业厅或拨打客服热线96956";
                                    }
                                } else {
                                    playTvStatus = "03";
                                    playCAMsg = SysSetting.getEventInfo(event_modifer);
                                }
                                smallHomeVideo.showCACover({ msg: playCAMsg });
                                document.body.style.background = "#000";
                                return false;
                            } else {
                                return true;
                            }
                            break;
                    }
                    return true;
                }
            };
            var videoPageMsg = epgCaMsg;
            this.initial = function() { //完成直播界面的初始化操作
                SysSetting.setEnv("PAGEFOCUSINDEX", "tv_page");
                JSDataAccess.setInfo({ "className": "DVBSetting", "info": "EPGNumdays", "value": "1" }); //搜索连续1天的节目信息
                JSDataAccess.setInfo({ "className": "DVBSetting", "info": "EPGStartDate", "value": "0" }); //将当天设为搜索起始日期
                PORTAL_ADDR = "http://" + DataAccess.getInfo("VodApp", "PortalAddress") + ":" + DataAccess.getInfo("VodApp", "PortalPort");
                
                //playCurrentService(RecLiveChannel.getRecChannel(7));  //直播推荐频道(小视频)
                leftListObj.initial(); //初始化左侧列表
                leftProImg = menuDataAccessObj.preLoadImg();
                groupListObj.initial(); //初始化分组列表
                recommendObj.initial(); //初始化推荐海报
                playTimer = -1;
                setTimeout(function(){
	                smallVideoObj.initial(); //初始化小视频窗口
	                setMediaplayer(1);
	                setMediaplayer(2);
	                initialVolumebar(); //初始化音量控制
	                setTimeout(function(){//隐藏背景图
	                	SumaJS.$("#background").style.display = "none";
	                },1000)
                },200)
                SumaJS.eventManager.addEventListener("epgCaMsg", epgCaMsg, 50);
                //每个block和一个eventHandler是绑定的。
                var tvPageCfg = [{
                        name: "SmallVideo", //block名称
                        level: 1, //级别
                        barObj: smallVideoObj,
                        parentBlockName: null, //父块名称
                        children: []
                    },
                    {
                        name: "LeftList", //block名称
                        level: 1, //级别
                        barObj: leftListObj,
                        parentBlockName: null, //父块名称
                        children: []
                    },
                    {
                        name: "GroupList", //block名称
                        level: 1, //级别
                        barObj: groupListObj,
                        parentBlockName: null, //父块名称
                        children: [
                        	{
			                    name: "ChannelList", //block名称
			                    level: 2,
			                    barObj: channelListObj,
			                    parentBlockName: "GroupList",
			                    children: []
			                }, 
			                {
			                    name: "AllChannel", //block名称
			                    level: 2,
			                    barObj: allChannelObj,
			                    parentBlockName: "GroupList",
			                    children: []
			                }
                        ]
                    },
                    {
                        name: "recommend", //block名称
                        level: 1,
                        barObj: recommendObj,
                        parentBlockName: null,
                        children: []
                    }
                ];
                var otherPageCfg = [{
                        name: "SmallVideo", //block名称
                        level: 1, //级别
                        barObj: smallVideoObj,
                        parentBlockName: null, //父块名称
                        children: []
                    },
                    {
                        name: "LeftList", //block名称
                        level: 1, //级别
                        barObj: leftListObj,
                        parentBlockName: null, //父块名称
                        children: []
                    },
                    {
                        name: "GroupList", //block名称
                        level: 1, //级别
                        barObj: groupListObj,
                        parentBlockName: null, //父块名称
                        children: []
                    },
                    {
                        name: "recommend", //block名称
                        level: 1,
                        barObj: recommendObj,
                        parentBlockName: null,
                        children: []
                    }
                ];

                var otherPageBlock = new Block(otherPageCfg);
                var tvPageBlock = new Block(tvPageCfg);
                var node = null;
                try {
                    if(closeCycleControl.checkIfDoCloseCycle(thisPageName)){  //是否闭环
                        SumaJS.debug("closeCycleControl is cycle="+thisPageName);
                        if (SumaJS.lastModuleName) { //判断是否是从其他页面跳转的
                            if (SumaJS.lastModuleName == "play_tv") { //是闭环，且是从全屏回来的
                                SumaJS.debug("closeCycleControl is cycle and come back from play_tv");
                                var recService = smallHomeVideo.getRecOrSiService(7);
                                if (recService) { //判断是否有推荐频道
                                    titleObj.getFocus(1);
                                    //数据采集相关
                                    if (smallHomeVideo.hasRecService(7, 0)) {
                                        changeTvMode = "25";
                                    } else if (smallHomeVideo.hasSiService(7, 1)) {
                                        changeTvMode = "27";
                                    } else {
                                        changeTvMode = "28";
                                    }
                                    if (smallHomeVideo.getNvodFlag()) {
                                        smallHomeVideo.playNvod(recService);
                                    } else {
                                        if (thisPageName == "tv_page") {
                                            playCurrentService(recService);
                                        } else {
                                            playCurrentServices(recService);
                                        }
                                    }
                                } else {
                                    node = closeCycleControl.popNode();
                                    if (typeof node != "undefined" && typeof node.infor != "undefined" &&
                                        typeof node.infor.name != "undefined" &&
                                        typeof node.infor.indexArr != "undefined") {
                                        titleObj.loseFocus(); //有闭环时title失焦								
                                        if (node.infor.name == "Header" || node.infor.name == "Footer" || node.infor.name == "Title") { //判断是否从titleList或者footerList跳转。
                                            closeCycleControl.cycleBack(threeBarBlock, node);
                                        } else {
                                        	setTimeout(function(){
                                            if (thisPageName == "tv_page") {
                                                if (node.infor.indexArr.length > 1) { //从第二层级跳转
                                                    secondLevelBackError();
                                                } else { //回到小视频需要继续播放
                                                    playCurrentService(currentService);
                                                }
                                            	closeCycleControl.cycleBack(tvPageBlock, node); //从module块跳转的
                                            }else{
                                            	closeCycleControl.cycleBack(otherPageBlock, node); //从module块跳转的
                                            }
                                            },100)
                                        }
                                    } else {
                                        SumaJS.debug("closeCycleControl.node is wrong!");
                                        titleObj.getFocus(thisPageIndex);
                                        var thisChannel = OffChannelObj.getOffChannel();
                                        if (thisPageName == "tv_page") {
                                            changeTvMode = "28"; //数据采集相关
                                            playCurrentService(thisChannel);
                                        } else {
                                            playCurrentServices(thisChannel);
                                        }
                                    }
                                }
                            } else { //五个板块间的切换
                                SumaJS.debug("closeCycleControl is not cycle");
                                titleObj.getFocus(thisPageIndex);
                            }
                        } else { //是闭环，从其他页面回来的
                            SumaJS.debug("closeCycleControl is cycle but not back from play_tv");
                            var node = closeCycleControl.popNode();
                            if (typeof node != "undefined" && typeof node.infor != "undefined" &&
                                typeof node.infor.name != "undefined" &&
                                typeof node.infor.indexArr != "undefined") {
                                titleObj.loseFocus(); //有闭环时title失焦								
                                if (node.infor.name == "Header" || node.infor.name == "Footer" || node.infor.name == "Title") { //判断是否从titleList或者footerList跳转。
                                    closeCycleControl.cycleBack(threeBarBlock, node);
                                } else {
                                	setTimeout(function(){
                                	if (thisPageName == "tv_page") {
                                    	closeCycleControl.cycleBack(tvPageBlock, node); 
                                    }else{
                                    	closeCycleControl.cycleBack(otherPageBlock, node); 
                                    }
                                    },100)
                                }
                            }
                        }
                        if (thisPageName == "tv_page") {
                            closeCycleControl.setIsBackToPage(0); //需要清除闭环
                        }
                    } else if (!closeCycleControl.checkIfDoCloseCycle("tv_page")) { //没闭环
                        SumaJS.debug("closeCycleControl is not cycle");
                        titleObj.getFocus(thisPageIndex);
                        if (thisPageName == "tv_page") {
                            //播放当前播放的频道
                            if (smallHomeVideo.getIsPlayingNvod()) {
                                var nvodObj = smallHomeVideo.getNvodObj();
                                smallHomeVideo.playNvod(nvodObj);
                            } else {
                                playCurrentService(currentService);
                            }
                        }
                    }
                } catch (e) {
                        SumaJS.debug("tv_page closeCycleControl deal with error");
                        titleObj.getFocus(thisPageIndex);
                    }            
                //第二级别跳转异常情况
                function secondLevelBackError() {
                    SumaJS.debug("secondLevelBackError entered 1");
                    var jumpObj = tvPageBlock.getObjByName(node.infor.name);
                    var parentJumpObj = tvPageBlock.getParentObj(node.infor.name);
                    SumaJS.debug("secondLevelBackError entered 2");
                    //根据跳转前一级列表的内容获取选中的一级列表下的所有二级列表数据
                    var groupItem = groupListObj.listObj.getItems()[parseInt(node.infor.indexArr[0])];
                    /*if (groupItem.name != "全部频道") {
                        var groupServices = groupItem.services;
                    } else {
                        var groupServices = allServices;
                    }*/
                    if (groupItem.name == "全部频道") {
						var groupServices = allServices;
                    }else if(groupItem.name == "常看频道"){
                    	return;
                    }else {
                        var groupServices = groupItem.services;
                    }
                    var jumpService = groupServices[node.infor.indexArr[1]];
                    SumaJS.debug("secondLevelBackError entered 3");
                    //全屏切台导致的异常处理
                    if (SumaJS.lastModuleName == "play_tv" && jumpService.channelId != currentService.channelId) { //进入和返回不相等
                        SumaJS.debug("jumpService.channelId != currentService.channelId");
                        node.infor.name = "AllChannel";
                        for (var i = 0, length = parentJumpObj.barObj.listObj.getItems().length; i < length; i++) {
                            if (parentJumpObj.barObj.listObj.getItems()[i].name == "全部频道") {
                                node.infor.indexArr[0] = i + "a";
                            }
                        }
                        for (var i = 0, length = allServices.length; i < length; i++) {
                            if (allServices[i].channelId == currentService.channelId) {
                                node.infor.indexArr[1] = i;
                            }
                        }
                    } else {
                        SumaJS.debug("jumpService.channelId == currentService.channelId");
                    }

                }
            };
            this.smallVideoObj = smallVideoObj; //用来与title进行交互
            this.leftListObj = leftListObj; //用来与footer进行交互
            this.groupListObj = groupListObj; //用来与footer进行交互          
            this.recommendObj = recommendObj; //用来与title进行交互
            this.playCurrentService = function(service) { //用来播放加载首页获取到的小视频窗口
                if (thisPageName == "tv_page") {
                    playCurrentService(service);
                } else {
                    SumaJS.debug("video_page playCurrentService " + service.serviceName);
                    currentService = service;
                    SumaJS.globalPlayer.playService(currentService);
                    setMediaplayer(2);
                    DVB.tune(currentService.tsInfo.Frequency, currentService.tsInfo.SymbolRate, currentService.tsInfo.Modulation);
                    OffChannelObj.saveOffChannel(currentService);
                }

            };
        }
        tvPageObj.initial();
        PageObj = tvPageObj; //用于交互
    }

    function onDestroy() {
		if (thisPageName == 'tv_page') {	
            SumaJS.eventManager.removeEventListener("channelListObjEvent");
            SumaJS.eventManager.removeEventListener("allChannelObjEvent");
            SumaJS.eventManager.removeEventListener("PanelEventHandler");
            SumaJS.eventManager.removeEventListener("oftenSetListObj");
            groupName = "";
        }
        SumaJS.eventManager.removeEventListener("tvPageEventHandler");
        SumaJS.eventManager.removeEventListener("SmallVideoEventHandler");
        SumaJS.eventManager.removeEventListener("leftListObjEvent");
        SumaJS.eventManager.removeEventListener("groupListObjEvent");
        SumaJS.eventManager.removeEventListener("RecommendObjEvent");
        SumaJS.eventManager.removeEventListener("volumebar");
        SumaJS.eventManager.removeEventListener("epgCaMsg");

		clearTimeout(playTimer);
        clearInterval(epgTimer);
        ADContrl.init();
		SumaJS.eventManager.removeEventListener("chanlist_epg");
        SumaJS.globalTimerManager.clearAll(); //清除定时器
        if (SumaJS.msgBox) {
            SumaJS.eventManager.removeEventListener("messageBox");
            SumaJS.msgBox = null;
        }
        if (!playSuccess) {
            document.body.style.background = "#000";
        }
        if (playCAMsg) {
            SumaJS.releasePlayer();
        }
        //smallHomeVideo.hideCover();  
        smallHomeVideo.hideCACover(); //切换module时隐藏小视频CA提示
    }
    return {
        onCreate: onCreate,
        onStart: onStart,
        onDestroy: onDestroy,
        parent: SumaJS.$("#container1")
    };
})());