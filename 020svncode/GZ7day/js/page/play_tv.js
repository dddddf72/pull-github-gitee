try {
    var dealAdTimer = -1;  //用来解决120秒刷新广告引发的循环问题。
    var playFunc = null;
    SumaJS.registerModule("play_tv", (function () {
        var initParam = null;
        function onCreate(param) {
			audio_bg.hide();  //隐藏音频背景图
            initParam = null;
            var playParam = "";
            var actionStr = SysSetting.getEnv("DINGGOU_BACK_ACTION");
            if (actionStr) {
                try {
                    var actionObj = JSON.parse(actionStr);
                    var status = "00";
                    if (actionObj.action == "success") {
                        status = "01";
                    } else if (actionObj.action == "failure") {
                        status = "02";
                    } else if (actionObj.action == "cancel") {
                        status = "03";
                    }
                    var pid = SysSetting.getEnv("LAST_PRODUCTID");
                    var pname = SysSetting.getEnv("LAST_PRODUCTNAME");
                    if (pid) {
                        var cid = SysSetting.getEnv("play_channelId");
                        if(cid){
                            DataCollection.collectData(["0e", pid, status, pname,cid.channelId, "01"]);
                        }else {
                            DataCollection.collectData(["0e", pid, status, pname, " ","01"]);
                        }
                    }
                } catch (e) {}
            }
            if (SysSetting.getEnv("playParam")) {
                playParam = SysSetting.getEnv("playParam");
                SysSetting.setEnv("playParam", "");
                changeTvMode = "06";
            } else if (SysSetting.getEnv("lastServiceObj")) {
                playParam = "{serviceInfo:" + SysSetting.getEnv("lastServiceObj") + "}";//兼容每日信息跳转到直播
                SysSetting.setEnv("lastServiceObj", "");
                //changeTvMode = "09";
            } else if (SysSetting.getEnv("changePage_playParam")) {
                playParam = SysSetting.getEnv("changePage_playParam");
                SysSetting.setEnv("changePage_playParam", "");
                changeTvMode = "00";
            } else if (SysSetting.getEnv("play_channelId")) {
                playParam = SysSetting.getEnv("play_channelId");
                SysSetting.setEnv("play_channelId", "");
                changeTvMode = "00";
            }

            if (SysSetting.getEnv("HOMETOPLAYTV") == "08" || SysSetting.getEnv("HOMETOPLAYTV") == "14") {
                if (!RecLiveChannel.isPushRec) {
                    changeTvMode = SysSetting.getEnv("HOMETOPLAYTV");
                }
                SysSetting.setEnv("HOMETOPLAYTV", "");
            } else if (SysSetting.getEnv("OTHERTOPALYTV")) {//must be last
                var type = SysSetting.getEnv("OTHERTOPALYTV");
                //alert("play.js,type ="+type)
                SysSetting.setEnv("OTHERTOPALYTV", "");
                changeTvMode = type;
                if (parseInt(type, 16) == 0x0a) {
                    SysSetting.setEnv("PORTAL_BACKFROMYULAN", "1");
                }
                if (type == "08" && playParam == "") {
                    //alert("push");
                    RecLiveChannel.pushRecChannel(4);
                }
            }
            if (playParam) {
                try {
                    initParam = eval("(" + playParam + ")");
                } catch (e) {
                    SumaJS.debug("init play tv param is not json");
                    initParam = null;
                }
            } else {
                initParam = null;
            }
            if (param && param[0] == "{" && param[param.length - 1] == "}") {
                //alert(param)
                initParam = JSON.parse(param);
            }
            SumaJS.getDom("shouye").style.display = "none";
            SumaJS.getDom("playtv_parent").style.display = "block";
            var renderConfig = {
                "entry": {
                    "type": "div",
                    "properties": {
                        "id": "play_bg"
                    },
                    "childNodes": [
                        //全屏遮罩
                        {
                            "type": "div",
                            "properties": {
                                "id": "play_bg_cover"
                            }
                        },
                        //台标
                        {
                            "type": "div",
                            "properties": {
                                "id": "play_pf_bar_channel_tag"
                            },
                            "childNodes": [
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_pf_bar_channel_name"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_pf_bar_channel_num"
                                    }
                                }
                            ]
                        },
                        //时移标识
                        {
                            "type": "div",
                            "properties": {
                                "id": "support_play_back"
                            }
                        },
                        //电视列表
                        {
                            "type": "div",
                            "styles": {},
                            "properties": {
                                "id": "play_channel_list"
                            },
                            "childNodes": [
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_channel_list_title"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_channel_list_focus"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_channel_list_scroll"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_channel_list_timeshift",
                                        "innerHTML": "时移"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_channel_list_more",
                                        "innerHTML": "更多"
                                    }
                                }, {
                                    "type": "list",
                                    "listCount": "11",
                                    "itemTemplate": {
                                        "properties": {
                                            "className": "play_channel_list_item",
                                        },
                                        "childNodes": [
                                            {
                                                "type": "div",
                                                "properties": {
                                                    "className": "play_channel_list_num_nofocus",
                                                    "id": "play_channel_list_num_$i"
                                                }
                                            }, {
                                                "type": "div",
                                                "properties": {
                                                    "className": "play_channel_list_name_nofocus",
                                                    "id": "play_channel_list_name_$i"
                                                }
                                            }
                                        ]
                                    },
                                    "properties": {
                                        "id": "play_channel_list_item",
                                    },
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "channel_AD_0"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "channel_AD_1"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "channel_AD_2"
                                    }
                                }
                            ]
                        },
                        //二级更多列表
                        {
                            "type": "div",
                            "styles": {},
                            "properties": {
                                "id": "play_second_menu_list"
                            },
                            "childNodes": [
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_second_menu_list_focus"
                                    }
                                }, {
                                    "type": "list",
                                    "listCount": "4",
                                    "itemTemplate": {
                                        "properties": {
                                            "className": "play_second_menu_item",
                                        },
                                        "childNodes": [
                                            {
                                                "type": "div",
                                                "properties": {
                                                    "className": "play_second_menu_list_name_nofocus",
                                                    "id": "play_second_menu_list_name_$i"
                                                }
                                            }
                                        ]
                                    },
                                    "properties": {
                                        "id": "play_second_menu_list_item"
                                    }
                                }
                            ]
                        },
                        //PF、右上角频道号
                        {
                            "type": "div",
                            "properties": {
                                "id": "play_pf_bar"
                            },
                            "childNodes": [

                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_pf_bar_wrap"

                                    },
                                    "childNodes": [
                                        {
                                            "type": "div",
                                            "properties": {
                                                "id": "play_pf_bar_time"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "id": "play_love"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "id": "play_lock"
                                            }
                                        },
                                        {
                                            "type": "div",
                                            "properties": {
                                                "id": "play_pf_info_p_time"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "id": "play_pf_info_p_name"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "id": "play_pf_info_f_time"
                                            }
                                        },
                                        {
                                            "type": "div",
                                            "properties": {
                                                "id": "play_pf_info_f_name"
                                            }
                                        }, {
                                            "type": "img",
                                            "properties": {
                                                "id": "play_pf_progress",
                                                "src": "images/play/pf_progress.png"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "id": "shoushi_bg"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "id": "sousuo_bg"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "pfbar_AD_0"
                                    }
                                }
                            ]
                        }, {
                            "type": "div",
                            "properties": {
                                "id": "play_tv_channel_number"

                            },
                            "childNodes": []
                        },
                        //音量控制
                        {
                            "type": "div",
                            "properties": {
                                "id": "play_tv_volume_bar"
                            },
                            "childNodes": [
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "volumebar_AD_0"
                                    }
                                },
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_volume_bar_progress"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_volume_bar_progress_point"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_volume_bar_num"
                                    }
                                }
                            ]
                        }, {
                            "type": "div",
                            "properties": {
                                "id": "play_tv_mute"
                            }
                        },
                        //增强型电视
                        {
                            "type": "div",
                            "properties": {
                                "className": "TVReception",
                                "id": "TVReception"
                            },
                            "childNodes": [
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "diaocha",
                                        "className": "diaocha"
                                    },
                                    "childNodes": [
                                        {
                                            "type": "a",
                                            "properties": {
                                                "innerHTML": "很好看",
                                                "id": "diaocha1",
                                                "href": "#"
                                            }
                                        },
                                        {
                                            "type": "a",
                                            "properties": {
                                                "innerHTML": "一般般",
                                                "id": "diaocha2",
                                                "href": "#"
                                            }
                                        },
                                        {
                                            "type": "a",
                                            "properties": {
                                                "innerHTML": "不好看",
                                                "id": "diaocha3",
                                                "href": "#"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        //节目信息
                        {
                            "type": "div",
                            "properties": {
                                "id": "play_tv_info_list"
                            },
                            "childNodes": [
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_event_tip"
                                    }
                                },
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_list_title"
                                    }
                                }, /*{
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_event_focus"
                                    }
                                },*/ {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_date_focus"
                                    }
                                },
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_date_list"
                                    },
                                    "childNodes": [
                                        {
                                            "type": "div",
                                            "styles": {
                                                "width": "113px"
                                            },
                                            "properties": {
                                                "className": "play_tv_info_date",
                                                "id": "play_tv_info_date0"
                                            }
                                        },
                                        {
                                            "type": "div",
                                            "styles": {
                                                "width": "113px"
                                            },
                                            "properties": {
                                                "className": "play_tv_info_date",
                                                "id": "play_tv_info_date1"
                                            }
                                        },
                                        {
                                            "type": "div",
                                            "styles": {
                                                "width": "113px"
                                            },
                                            "properties": {
                                                "className": "play_tv_info_date",
                                                "id": "play_tv_info_date2"
                                            }
                                        }, {
                                            "type": "div",
                                            "styles": {
                                                "width": "113px"
                                            },
                                            "properties": {
                                                "className": "play_tv_info_date",
                                                "id": "play_tv_info_date3"
                                            }
                                        }, {
                                            "type": "div",
                                            "styles": {
                                                "width": "113px"
                                            },
                                            "properties": {
                                                "className": "play_tv_info_date",
                                                "id": "play_tv_info_date4"
                                            }
                                        }, {
                                            "type": "div",
                                            "styles": {
                                                "width": "113px"
                                            },
                                            "properties": {
                                                "className": "play_tv_info_date",
                                                "id": "play_tv_info_date5"
                                            }
                                        }, {
                                            "type": "div",
                                            "styles": {
                                                "width": "113px"
                                            },
                                            "properties": {
                                                "className": "play_tv_info_date",
                                                "id": "play_tv_info_date6"
                                            }
                                        },
                                    ]
                                },
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_event_item"
                                    },
                                    "childNodes": [
                                        {
                                            "type": "list",
                                            "listCount": "11",
                                            "properties": {
                                                "id": "play_tv_info_event_item_content"
                                            },
                                            "childNodes":[{
                                                "type": "div",
                                                "properties": {
                                                    "id": "play_tv_info_event_focus"
                                                }
                                            }],
                                            "itemTemplate": {
                                                "properties": {
                                                    "className": "play_tv_info_event_item"
                                                },
                                                "childNodes": [
                                                    {
                                                        "type": "div",
                                                        "properties": {
                                                            "className": "play_tv_info_event_time",
                                                            "id": "play_tv_info_event_time$i"
                                                        }
                                                    }, {
                                                        "type": "div",
                                                        "properties": {
                                                            "className": "play_tv_info_event_name",
                                                            "id": "play_tv_info_event_name$i"
                                                        }
                                                    }, {
                                                        "type": "div",
                                                        "properties": {
                                                            "className": "play_tv_info_event_flag",
                                                            "id": "play_tv_info_event_flag$i"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_list_desc"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_list_ad"
                                    },
                                    "childNodes": [
                                        {
                                            "type": "img",
                                            "properties": {
                                                "id": "play_tv_info_list_ad_img",
                                                "src": ""
                                            }
                                        }
                                    ]
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_list_ad_key"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_event_scroll"
                                    }
                                }
                            ]
                        }, {
                            "type": "div",
                            "styles": {},
                            "properties": {
                                "innerHTML": "&nbsp;",
                                "className": "playtv_osd",
                                "id": "osd"
                            }
                        }, {
                            "type": "div",
                            "styles": {},
                            "properties": {
                                "innerHTML": "&nbsp;",
                                "className": "playtv_test_str_len",
                                "id": "test_str_len"
                            }
                        }, /*{
                            "type": "div",
                            "properties": {
                                "id": "width_calc"
                            }
                        }, */{
                            "type": "div",
                            "properties": {
                                "id": "channel_info_box"

                            },
                            "childNodes": [
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "channel_info_title"
                                    }
                                }, {
                                    "type": "list",
                                    "listCount": "5",
                                    "properties": {
                                        "id": "channel_info_item"

                                    },
                                    "itemTemplate": {
                                        "childNodes": [
                                            {
                                                "type": "div",
                                                "styles": {},
                                                "properties": {
                                                    "innerHTML": "&nbsp;",
                                                    "className": "chan_info_cell0",
                                                    "id": "chan_info_cell0_$i"
                                                }
                                            }, {
                                                "type": "div",
                                                "styles": {},
                                                "properties": {
                                                    "innerHTML": "&nbsp;",
                                                    "className": "chan_info_cell1",
                                                    "id": "chan_info_cell1_$i"
                                                }
                                            }, {
                                                "type": "div",
                                                "styles": {},
                                                "properties": {
                                                    "innerHTML": "&nbsp;",
                                                    "className": "chan_info_cell2",
                                                    "id": "chan_info_cell2_$i"
                                                }
                                            }, {
                                                "type": "div",
                                                "styles": {},
                                                "properties": {
                                                    "innerHTML": "&nbsp;",
                                                    "className": "chan_info_cell3",
                                                    "id": "chan_info_cell3_$i"
                                                }
                                            }
                                        ]
                                    }
                                }, {
                                    "type": "div",
                                    "styles": {},
                                    "properties": {
                                        "innerHTML": "按【红色】键关闭",
                                        "className": "channel_info_tip"
                                    }
                                }
                                /////////////////////////////////////////
                            ]
                        }, {
                            "type": "div",
                            "properties": {
                                "id": "mail_icon"
                            }
                        },
                        //连看信息
                        {
                            "type": "div",
                            "properties": {
                                "id": "play_tv_info_relate_list"
                            },
                            "childNodes": [
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_relate_tip"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_relate_program_name"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_relate_focus"
                                    }
                                }, {
                                    "type": "list",
                                    "listCount": "10",
                                    "properties": {
                                        "id": "play_tv_info_relate_item"
                                    },
                                    "itemTemplate": {
                                        "childNodes": [
                                            {
                                                "type": "div",
                                                "properties": {
                                                    "className": "play_tv_info_relate_order",
                                                    "id": "play_tv_info_relate_order$i"
                                                }
                                            }, {
                                                "type": "div",
                                                "properties": {
                                                    "className": "play_tv_info_relate_type",
                                                    "id": "play_tv_info_relate_type$i"
                                                }
                                            }, {
                                                "type": "div",
                                                "properties": {
                                                    "className": "play_tv_info_relate_playsource",
                                                    "id": "play_tv_info_relate_playsource$i"
                                                }
                                            }
                                        ]
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_relate_scroll"
                                    }
                                }
                            ]
                        },//常看信息
                        {
                            "type": "div",
                            "properties": {
                                "id": "play_tv_info_fav_list"
                            },
                            "childNodes": [
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_fav_tip"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_fav_current_status"
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_fav_focus"
                                    }
                                }, {
                                    "type": "list",
                                    "listCount": "10",
                                    "properties": {
                                        "id": "play_tv_info_fav_item"
                                    },
                                    "itemTemplate": {
                                        "childNodes": [
                                            {
                                                "type": "div",
                                                "properties": {
                                                    "className": "play_tv_info_fav_name",
                                                    "id": "play_tv_info_fav_name$i"
                                                }
                                            }
                                        ]
                                    }
                                }, {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_info_fav_scroll"
                                    }
                                }
                            ]
                        },
                        //直播收视排行
                        {
                            "type": "div",
                            "properties": {
                                "id": "channel_top"
                            },
                            "childNodes": [
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_tv_channel_top_tip"
                                    }
                                },
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "currentchannel_top"
                                    },
                                    "childNodes": [
                                        {
                                            "type": "div",
                                            "properties": {
                                                "className": "chan_top_cell0",
                                                "id": "currentchannel_top_cell0"
                                            },
                                            "styles": {
                                                //"background":"url(images/play/playing.png) no-repeat center",
                                                //"color": "#FFFFFF"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "className": "chan_top_cell1",
                                                "id": "currentchannel_top_cell1"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "className": "chan_top_cell2",
                                                "id": "currentchannel_top_cell2"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "className": "chan_top_cell3",
                                                "id": "currentchannel_top_cell3"
                                            }
                                        }, {
                                            "type": "div",
                                            "properties": {
                                                "className": "chan_top_cell4",
                                                "id": "currentchannel_top_cell4"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "channel_top_focus"
                                    }
                                },
                                {
                                    "type": "list",
                                    "listCount": "4",
                                    "properties": {
                                        "id": "channel_top_item"
                                    },
                                    "itemTemplate": {
                                        "properties": {
                                            "className": "channel_top_item"
                                        },
                                        "childNodes": [
                                            {
                                                "type": "div",
                                                "properties": {
                                                    "className": "chan_top_cell0",
                                                    "id": "chan_top_cell0_$i"
                                                }
                                            }, {
                                                "type": "div",
                                                "properties": {
                                                    "className": "chan_top_cell1",
                                                    "id": "chan_top_cell1_$i"
                                                }
                                            }, {
                                                "type": "div",
                                                "properties": {
                                                    "className": "chan_top_cell2",
                                                    "id": "chan_top_cell2_$i"
                                                }
                                            }, {
                                                "type": "div",
                                                "properties": {
                                                    "className": "chan_top_cell3",
                                                    "id": "chan_top_cell3_$i"
                                                }
                                            }, {
                                                "type": "div",
                                                "properties": {
                                                    "className": "chan_top_cell4",
                                                    "id": "chan_top_cell4_$i"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "channel_top_scroll"
                                    }
                                }
                            ]
                        },
                        //直播收视排行end
                        //正在免费预览提示  start
                        {
                            "type": "div",
                            "properties": {
                                "id": "play_free_preview_tips"
                            },
                            "childNodes": [
                                {
                                    "type": "div",
                                    "properties": {
                                        "id": "play_free_preview_tips_text",
                                        "innerHTML": "您未订购该频道，当前正在免费预览，结束后可选择是否开通。"
                                    }
                                }
                            ]
                        }
                        //正在免费预览提示  end
                    ]
                }
            };
            this.render(renderConfig);
			setTimeout(function(){
	            var channelInfoTitle = [
	                ["Service ID : ", "调制方式 : ", "Video PID : ", "信号质量 : ", "误码率 : "],
	                ["频率 : ", "PCR PID : ", "Audio PID : ", "信号强度 : ", "信号电平 : "]
	            ];
	            for (var i = 0; i < 5; i++) {
	                var top = 55 * i + "px";
	                var dom0 = SumaJS.getDom("chan_info_cell0_" + i);
	                var dom1 = SumaJS.getDom("chan_info_cell1_" + i);
	                var dom2 = SumaJS.getDom("chan_info_cell2_" + i);
	                var dom3 = SumaJS.getDom("chan_info_cell3_" + i);
	                dom0.style.top = top;
	                dom1.style.top = top;
	                dom2.style.top = top;
	                dom3.style.top = top;
	                dom0.innerHTML = channelInfoTitle[0][i];
	                dom2.innerHTML = channelInfoTitle[1][i];
	            }
            },2000);
        }

        function onStart() {
        	var channelInfoIs = true;
        	var playTvChannelListIs=true;
        	var chanNumIs = true;
            /******************频道号、频道数据库、全屏加载处理 START******************/
                //常看,连看,回看列表失焦和获焦样式控制对象
            var thirdListStyleControl = {
				setStyleOnFocus: function(dom,small){
					if(dom.nodeType){
					    if(small==1){
                            dom.style.fontSize = "20px";
                        }else{
                            dom.style.fontSize = "22px";
                        }
                        dom.style.color = "#FFFFFF";
                        dom.style.fontWeight = "bold";
					}										
				},
				setStyleLoseFocus: function(dom,small){
					if(dom.nodeType){
                        if(small==1){
                            dom.style.fontSize = "18px";
                        }else{
                            dom.style.fontSize = "20px";
                        }
                        dom.style.color = "#8b9299";
                        dom.style.fontWeight = "normal";
					}					
				}			
            };

            //免费预览新添加的提示控制， add by liwenlei
            var freePreviewTipsControls = (function(){
                var thisUI = SumaJS.$("#play_free_preview_tips");
                return {
                    show: function(){
                        thisUI.style.display = "block";
                    },
                    hide: function(){
                        thisUI.style.display = "none";
                    }
                }
            }());
            if(freePreviewFlag){
                freePreviewTipsControls.show();
            }
            clearTimeout(playTvTimer);
            SysSetting.setEnv("PAGEFOCUSINDEX", "play_tv");
            setMediaplayer(1);
            JSDataAccess.setInfo({"className": "DVBSetting", "info": "EPGNumdays", "value": "1"});
            JSDataAccess.setInfo({"className": "DVBSetting", "info": "EPGStartDate", "value": "0"});
            var portalAddr = DataAccess.getInfo("VodApp", "PortalAddress") + ":" + DataAccess.getInfo("VodApp", "PortalPort");
            var beforLogicalChannelId = null;   //前一个频道信息   
            var channelNumIndex = -1;   //频道号索引

            var timeShiftEvent = [];
            var currChannelEvent = [];
            if (!SumaJS.globalServiceInfo) {
                SumaJS.getServiceInfo();
            }
            var serviceInfo = SumaJS.getServiceInfoExceptAudioService();
            var offchannel = SysSetting.getEnv("OFF_CHANNEL");
            if (offchannel) {
                offchannel = JSON.parse(offchannel);
            }
            var serviceType = -1;
            var logicalChannelId = 0;
            var currentSerIndex = 0;

            if (initParam) {
                if (typeof(initParam.channelId) != "undefined") {
                    var tempService = SumaJS.getServiceByChannelId(initParam.channelId);
                    if (tempService) {
                        logicalChannelId = tempService.logicalChannelId;
                        serviceType = tempService.serviceType;
                    }
                } else if (typeof(initParam.serviceInfo) != "undefined") {
                    var serInfo = initParam.serviceInfo;
                    for (var j = 0; j < serviceInfo.length; j++) {
                        if (serInfo.TSID == serviceInfo[j].tsInfo.TsId && serInfo.serviceID == serviceInfo[j].serviceId) {
                            logicalChannelId = serviceInfo[j].logicalChannelId;
                            serviceType = serviceInfo[j].serviceType;
                            break;
                        }
                    }

                }
            } else {
                if (offchannel) {
                    for (var j = 0; j < serviceInfo.length; j++) {
                        if (offchannel.logicalChannelId == serviceInfo[j].logicalChannelId) {
                           logicalChannelId = serviceInfo[j].logicalChannelId;
                            serviceType = serviceInfo[j].serviceType;
                            break;
                        }
                    }
                }
            }

            var channelNumId = [];      //频道号
            if (serviceInfo) {

                //逻辑频道号排序

                for (var j = 0; j < serviceInfo.length - 1; j++) {
                    for (var k = j + 1; k < serviceInfo.length; k++) {
                        if (parseInt(serviceInfo[j].logicalChannelId, 10) > parseInt(serviceInfo[k].logicalChannelId, 10)) {
                            var temp = serviceInfo[j];
                            serviceInfo[j] = serviceInfo[k];
                            serviceInfo[k] = temp;
                        }
                    }
                }
                //没有关机频道的情况下播第一个
                if (serviceType == -1) {
                    logicalChannelId = serviceInfo[0].logicalChannelId;
                    serviceType = serviceInfo[0].serviceType;
                }

                //获取全部频道号
                for (var i = 0, n = 0; i < serviceInfo.length; i++) {
                    channelNumId[n] = serviceInfo[i].logicalChannelId;
                    n++;
                }
                //查找currentSerIndex
                var flag = false;
                for (var i = 0; i < serviceInfo.length; i++) {

                    if (serviceInfo[i].logicalChannelId == logicalChannelId) {
                        currentSerIndex = i;
                        flag = true;
                        break;
                    }
                    if (flag) {
                        break;
                    }
                }
            }

            channelNumId.sort(function (num1, num2) {
                if (parseInt(num1, 10) < parseInt(num2, 10)) {
                    return -1;
                } else if (parseInt(num1, 10) == parseInt(num2, 10)) {
                    return 0;
                } else {
                    return 1;
                }
            });

            //去除重复台号
            var lastId = -1;
            for (var i = 0; i < channelNumId.length;) {
                if (lastId == parseInt(channelNumId[i], 10)) {
                    channelNumId.splice(i, 1);
                } else {
                    lastId = channelNumId[i];
                    i++;
                }
            }
            /******************频道号、频道数据库、全屏加载处理 END******************/
           
           /*********************如加资讯扩展功能***************************/
             //rojaoAdv全局变量
            (function () {
                var advFrame = null;
                var msgObj = null;
                var timer = -1;
                var showFlag = false;
                var advEnable = false; //增加advEnable用于判断是否启用广告，是否启用广告判断条件为originalArray.AdvInfo.InfoPid不为0

                rojaoAdv = function () {
                    this.isVisible = false;
                    this.advEnable = false;
                };

                rojaoAdv.prototype.isEnable = function () {
                    return advEnable;
                }
                rojaoAdv.prototype.init = function () {
                    if (!originalArray || !originalArray.AdvInfo || !originalArray.AdvInfo.InfoPid || originalArray.AdvInfo.InfoPid == 0) {
                        return;
                    }
                    advEnable = true;
                    if (!advFrame) {
                        var ifm = document.createElement("iframe");
                        ifm.name = "adv_frame";
                        ifm.style.position = "absolute";
                        ifm.style.left = "0px";
                        ifm.style.top = "0px";
                        ifm.style.width = "1280px";
                        ifm.style.height = "720px";
                        ifm.style.display = "none";
                        ifm.frameBorder = "0";
                        document.body.appendChild(ifm);
                        advFrame = ifm;
                    }
                    var advEvent = getMsgObj();
                    if (advEvent) {
                        msgObj = advEvent;
                    }
                };

                rojaoAdv.prototype.setHotKey = function (hotkey) {
                    msgObj.HotKey = hotkey;
                    saveMsgObj();
                }
                rojaoAdv.prototype.onAdvEvent = function (evtStr) {
                    try {
                        SumaJS.debug(evtStr);
                        var evtObj = eval("(" + evtStr + ")");
                    } catch (e) {
                        var evtObj = null;
                        SumaJS.debug("==============error:" + e.message);
                    }
                    msgObj = evtObj;
                    msgObj.ReceiveTime = new Date().getTime();
                    SumaJS.debug("==============rojaoAdv receiveTime : " + msgObj.ReceiveTime);
                    saveMsgObj();
                };

                rojaoAdv.prototype.onKeyEvent = function (evt) {
                    if (!this.isVisible)
                        return true;
                    var evtCode = evt.which;
                    var evtModifiers = {
                        "Status": "success",
                        "MsgType": msgObj.MsgType,
                        "Version": msgObj.Version
                    };

                    if (SysSetting.sendAppEvent) {
                        SysSetting.sendAppEvent(21002, JSON.stringify(evtModifiers), 0, 0);
                    }
                    var flag = false;
                    if (Array.isArray(msgObj.HotKey) && msgObj.HotKey.length > 0) {
                        for (var i = 0; i < msgObj.HotKey.length; i++) {
                            if (msgObj.HotKey[i] == evtCode) {
                                flag = true;
                                break;
                            }
                        }

                    } else {
                        if (msgObj.HotKey == evtCode) {
                            flag = true;
                        }
                    }
                    if (flag) {
                        var eventHandle = advFrame.contentWindow.document.onkeydown || advFrame.contentWindow.document.onkeypress;
                        if (eventHandle) {
                            eventHandle(evt);
                        }
                        return false;
                    } else {
                        return true;
                    }
                };

                rojaoAdv.prototype.show = function () {
                    if (!msgObj) return;
                    SumaJS.debug("==============rojaoAdv AutoHideTime : " + msgObj.AutoHideTime);
                    if (!showFlag)
                        return;
                    if (new Date().getTime() - msgObj.ReceiveTime > msgObj.AutoHideTime * 1000) {
                        return;
                    }
                    if (msgObj.DisplayTimes != 65535) {
                        if (msgObj.DisplayTimes > 0) {
                            msgObj.DisplayTimes--;
                        } else {
                            return;
                        }
                    }
                    if (!FileSystem.existlocalFile(msgObj.Url)) {
                        return;
                    }
                    this.isVisible = true;
                    saveMsgObj();
                    advFrame.style.display = "block";
                    advFrame.src = "file://" + msgObj.Url;
                    //用户行为数据采集
                    var adName = msgObj.Url.substr(msgObj.Url.lastIndexOf("/") + 1);
                    DataCollection.collectData(["09", "06", "06", "00", adName, adName]);
                    if (msgObj.duration != 65535) {
                        var self = this;
                        timer = setTimeout(function () {
                            self.hide();
                        }, msgObj.Duration * 1000);
                    }
                };

                rojaoAdv.prototype.hide = function () {
                    this.isVisible = false;
                    if (typeof(SysSetting.setLoadProgressFlag) == "function") {
                        SysSetting.setLoadProgressFlag(0);
                        SysSetting.setEnv("LoadProgressFlag", "0");
                    }
                    advFrame.style.display = "none";
                    advFrame.src = "html/blank.html";
                    clearTimeout(timer);
                    if (showFlag && msgObj.DisplayTimes != 0) {
                        var self = this;
                        timer = setTimeout(function () {
                            self.show();
                        }, msgObj.Interval * 1000);
                    }
                };

                rojaoAdv.prototype.close = function () {
                    clearTimeout(timer);
                    this.isVisible = false;
                    if (typeof(SysSetting.setLoadProgressFlag) == "function") {
                        SysSetting.setLoadProgressFlag(0);
                        SysSetting.setEnv("LoadProgressFlag", "0");
                    }
                    advFrame.style.display = "none";
                    advFrame.src = "html/blank.html";
                };

                rojaoAdv.prototype.checkAdvBinding = function (networkId, tsId, serviceId) {
                    if (!msgObj) return;
                    showFlag = false;
                    if (!msgObj.Services) {
                        showFlag = true;
                    } else {
                        var bindType = msgObj.BindType;
                        var services = msgObj.Services;
                        var findFlag = false;
                        for (var i = 0; i < services.length; i++) {
                            SumaJS.debug("=====================checkAdvBinding service:" + services[i]);
                            if (services[i][0] == networkId && services[i][1] == tsId && services[i][2] == serviceId) {
                                findFlag = true;
                                break;
                            }
                        }

                        if ((bindType == "forward" && findFlag) || (bindType == "inverse" && !findFlag)) {
                            showFlag = true;
                        } else {
                            showFlag = false;
                        }
                    }
                    SumaJS.debug("=====================checkAdvBinding showFlag:" + showFlag);
                    if (showFlag) {
                        if (!this.isVisible) {
                            this.show();
                        }
                    } else {
                        if (this.isVisible) {
                            this.close();
                        }
                    }
                };

                function saveMsgObj() {
                    SysSetting.setEnv("rojaoAdv", JSON.stringify(msgObj));
                }

                function getMsgObj() {
                    var msgStr = SysSetting.getEnv("rojaoAdv");
                    if (msgStr != "") {
                        return eval("(" + msgStr + ")");
                    } else {
                        return null;
                    }
                }

                rojaoAdv = new rojaoAdv();
            })();
            rojaoAdv.init();

            document.onappevent = function (event) {
                var evtCode = event.which;
                var evtModifiers = event.modifiers;
                SumaJS.debug("onappevent  evtCode=" + evtCode);
                switch (evtCode) {
					case 100:
						var str = SysSetting.getEventInfo(event.modifiers);
						FSMsgBox.show(eval("("+str+")"));
						break;
                    case 21001:
                        SumaJS.debug("currentService=" + currentService + "  isEnable=" + rojaoAdv.isEnable());
                        if (currentService && rojaoAdv.isEnable()) {
                            rojaoAdv.onAdvEvent(SysSetting.getEventInfo(evtModifiers));
                            rojaoAdv.close();
                            rojaoAdv.checkAdvBinding(currentService.networkId, currentService.tsInfo.TsId, currentService.serviceId);
                        }
                        break;
                }
            };
            /*********************如加资讯扩展功能 END***********************/
            //如加资讯扩展按键处理
            var rojaoAdvHandler = {
                eventHandler: function (event) {
                    if (rojaoAdv && rojaoAdv.isEnable() && !rojaoAdv.onKeyEvent(event)) {
                        return false;
                    }
                    return true;
                }
            };
            SumaJS.eventManager.addEventListener("rojaoAdvHandler", rojaoAdvHandler, 33);
            /****************************************频道列表控制**************************************/
            var playTvChannelListObj,playTvListHandler;
            playTvChannelListObj = new function () {
                var self = this;
                this.moreFlag = 0;
                this.timeshiftFlag = 0;
                this.listObj = null;
               this.pageSizes = serviceInfo.length>11?11:serviceInfo.length;
                this.createPlayTvList = function () {
                    var chanlistNames = [];
                    var chanlistNum = [];

                    for (var i = 0; i < self.pageSizes; i++) {
                        chanlistNum.push(SumaJS.getDom("play_channel_list_num_" + i));
                        chanlistNames.push(SumaJS.getDom("play_channel_list_name_" + i));
                        //chanlistFlag.push(SumaJS.getDom("play_channel_list_flag_" + i));
                    }
                    var cfg = {
                        index: currentSerIndex,
                        items: serviceInfo,
                        pageSize: self.pageSizes,
                        type: 5,
                        uiObj: {
                            numArray: chanlistNum,
                            nameArray: chanlistNames,
                            itemArray: SumaJS.$(".play_channel_list_item"),
                            timeshiftIcon: SumaJS.getDom("play_channel_list_timeshift"),
                            moreIcon: SumaJS.getDom("play_channel_list_more"),
                            focusBg: SumaJS.getDom("play_channel_list_focus"),
                            scrollBg: SumaJS.getDom("play_channel_list_scroll")
                        },
                        showData: function (dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                            if (isUpdate) {
                                if (!dataObj) {
                                    for (var i = 0; i < uiObj.nameArray.length; ++i) {
                                        uiObj.nameArray[i].innerHTML = "";
                                        uiObj.numArray[i].innerHTML = "";
                                    }
                                    uiObj.timeshiftIcon.style.display = "none";
                                    uiObj.moreIcon.style.display = "block";//none
                                    uiObj.scrollBg.style.top = 0 + "px";
                                    uiObj.focusBg.style.top = 0 + "px";
                                    uiObj.nameArray[0].innerHTML = "<div style='width:100%;text-align:center;'>无节目</div>";
                                } else {
                                    uiObj.focusBg.style.display = "block";
                                    for (var i = 0; i < uiObj.nameArray.length; ++i) {
                                        uiObj.nameArray[i].className = "play_channel_list_name_nofocus";
                                        uiObj.numArray[i].className = "play_channel_list_num_nofocus";
                                        if (dataObj[i]) {
                                            uiObj.nameArray[i].innerHTML = dataObj[i].serviceName;
                                            uiObj.numArray[i].innerHTML = dataObj[i].logicalChannelId;
                                            //uiObj.flagArray[i].style.display = dataObj[i].playback ? "block" : "none";
                                        } else {
                                            uiObj.nameArray[i].innerHTML = "";
                                            uiObj.numArray[i].innerHTML = "";
                                            uiObj.timeshiftIcon.style.display = "none";
                                            uiObj.moreIcon.style.display = "block";//none
                                        }
                                    }
                                }
                            } else if (lastFocusPos > -1) {
                                uiObj.nameArray[lastFocusPos].className = "play_channel_list_name_nofocus";
                                uiObj.numArray[lastFocusPos].className = "play_channel_list_num_nofocus";
                                uiObj.nameArray[lastFocusPos].innerHTML = dataObj[lastFocusPos].serviceName;
                            }
                            if (focusPos > -1) {
                                uiObj.focusBg.style.top = -5+focusPos * 47 + "px";
                                uiObj.moreIcon.style.top = 15 + focusPos * 47 + "px";
                                uiObj.timeshiftIcon.style.top = 15 + focusPos * 47 + "px";
                                self.setGetFocusStyle();
                                uiObj.nameArray[focusPos].className = "play_channel_list_name_focus";
                                uiObj.numArray[focusPos].className = "play_channel_list_num_focus";
                                uiObj.nameArray[focusPos].innerHTML = displayText(dataObj[focusPos].serviceName, 173, 22);
                                if (playTvHandler.service && dataObj[focusPos].serviceName == playTvHandler.service.serviceName) {
                                    uiObj.moreIcon.style.display = "block";
                                    self.moreFlag = 1;
                                    uiObj.timeshiftIcon.style.display = "block";
                                    // uiObj.timeshiftIcon.style.display = dataObj[focusPos].playback ? "block" : "none";
                                    self.timeshiftFlag = dataObj[focusPos].playback ? 1 : 0;
                                } else {
                                    uiObj.timeshiftIcon.style.display = "none";
                                    uiObj.moreIcon.style.display = "block";//none
                                    self.moreFlag = 0;
                                    self.timeshiftFlag = 0;
                                }
                                //判断是不是时移频道 通过playback的值
                                if(dataObj[focusPos].playback == 1){
                                    uiObj.timeshiftIcon.style.display = "block";
                                }else{
                                    uiObj.timeshiftIcon.style.display = "none";
                                }
                            }
                        }
                    };
                    this.listObj = new SubList(cfg);
                };
                this.setGetFocusStyle = function () {
                    this.listObj.uiObj.itemArray[4].style.color = "#FFFFFF";
                    this.listObj.uiObj.itemArray[5].style.color = "#FFFFFF";
                    this.listObj.uiObj.itemArray[6].style.color = "#FFFFFF";
                    SumaJS.getDom("play_channel_list_item").style.background = 'url("images/play/channelist_bg.png") no-repeat';
                    this.listObj.uiObj.itemArray[4].style.backgroundColor = "";
                    this.listObj.uiObj.itemArray[5].style.backgroundColor = "";
                    this.listObj.uiObj.itemArray[6].style.backgroundColor = "";
                };
                this.setLoseFocusStyle = function () {
                    this.listObj.uiObj.itemArray[4].style.color = "#8b9299";
                    this.listObj.uiObj.itemArray[5].style.color = "#8b9299";
                    this.listObj.uiObj.itemArray[6].style.color = "#8b9299";
                    this.listObj.uiObj.itemArray[this.listObj.focusPos].style.color = "#FFFFFF";
                    //this.listObj.uiObj.itemArray[this.listObj.focusPos].style.backgroundColor = "rgba(63, 77, 110, 0.8)";
					this.listObj.uiObj.itemArray[this.listObj.focusPos].style.backgroundColor = "rgba(116, 140, 194, 0.15)";					
                    this.listObj.uiObj.nameArray[this.listObj.focusPos].className = "play_channel_list_name_nofocus";
                    this.listObj.uiObj.numArray[this.listObj.focusPos].className = "play_channel_list_num_nofocus";
                    this.listObj.uiObj.nameArray[this.listObj.focusPos].innerHTML = this.listObj.getItem().serviceName;
                    this.listObj.uiObj.moreIcon.style.display = "none";
                    this.listObj.uiObj.timeshiftIcon.style.display = "none";
                    this.listObj.uiObj.focusBg.style.display = "none";
                    SumaJS.getDom("play_channel_list_item").style.background = 'url("images/play/channelist_bg_blur.png") no-repeat';
                };
            };

            playTvListHandler = {
                focus: 0,
                hideTime: 5000,
                showTimer: -1,
                right: function () {
                    this.hideTimer();
                    clearTimeout(this.showTimer);
                    playTvChannelListObj.setLoseFocusStyle();
                    playTvSecondMenuListHandler.show();
                    playTvSecondMenuListHandler.focus = 1;
                    playTvSecondMenuListObj.secondMenuList.setFocusPos(2);//设置二级列表默认回看获得焦点
                },
                left: function () {
                    this.hideTimer();
                    //playTvList.resetData({index: 0, items: currServices});
                    if (playTvChannelListObj.listObj.getItem().playback == 1) { //playTvChannelListObj.timeshiftFlag
                        toTimeShift(playTvChannelListObj.listObj.getItem());//currentService
                    }
                },
                up: function () {
                    this.hideTimer();
                    playTvChannelListObj.listObj.up();
                },
                down: function () {
                    this.hideTimer();
                    playTvChannelListObj.listObj.down();
                },
                pageUp: function () {
                    this.hideTimer();
                    playTvChannelListObj.listObj.pageUp();
                },
                pageDown: function () {
                    this.hideTimer();
                    playTvChannelListObj.listObj.pageDown();
                },
                show: function (playfirst) {
                    if (playfirst) {//首次进直播不隐藏PF和频道号，隐藏PF 广告
                        SumaJS.getDom("pfbar_AD_0").style.display = "none";
                        SumaJS.getDom("play_pf_bar").className = "play_pf_bar_short";
                    } else {
                        try{chanNumObj.hidden();}catch(e){};
                        playTvHandler.setFocusState(0);
                    }
                    volumebar.setFocusState(0);

                    SumaJS.getDom("play_channel_list").style.display = "block";
                    SumaJS.getDom("support_play_back").style.display = "none";
                    SumaJS.getDom("play_bg_cover").style.display = "block";
                    SumaJS.getDom("play_pf_bar_channel_tag").style.display = "block";

                    var tempServices = [];
                    if (serviceInfo) {
                        tempServices = serviceInfo;
                    }
                    playTvChannelListObj.listObj.resetData({index: playTvChannelListObj.listObj.getIndex(), items: tempServices});
                    this.focus = 1;
                    this.hideTimer();

                    if (!ADContrl.channelShowFlag) {
                        ADContrl.switchChannelImg();
                        ADContrl.channelShowFlag = true;
                    }

                },
                hide: function () {
                    clearTimeout(this.showTimer);
                    this.focus = 0;
                    SumaJS.getDom("play_channel_list").style.display = "none";
                    SumaJS.getDom("play_bg_cover").style.display = "none";
                    SumaJS.getDom("play_pf_bar_channel_tag").style.display = "none";

                    if (playTvHandler) {
                        playTvHandler.focus = 1;
                    }

                    if (ADContrl.channelShowFlag) {
                        //ADContrl.preloadImgs();
                        ADContrl.channelShowFlag = false;
                    }
                },
                hideTimer: function () {
                    clearTimeout(this.showTimer);
                    var self = this;
                    self.showTimer = setTimeout(function () {
                        self.hide();
                        playTvHandler.focus = 1;
                    }, self.hideTime);
                },
                eventHandler: function (event) {
                    var val = event.keyCode || event.which;
                    SumaJS.debug("====playtv playTvListHandler get msg=== which[" + val + "]");
                    if (!this.focus) {
                        return true;
                    }
                    switch (val) {
                        case KEY_LEFT:
                            this.left();
                            break;
                        case KEY_RIGHT:
                            this.right();
                            break;
                        case KEY_UP:
                            this.up();
                            break;
                        case KEY_DOWN:
                            this.down();
                            break;
                        case KEY_PAGE_UP:
                            this.pageUp();
                            break;
                        case KEY_PAGE_DOWN:
                            this.pageDown();
                            break;
                        case KEY_ENTER:
                            this.hide();
                            if (!playTvChannelListObj.listObj.getItem() || playTvChannelListObj.listObj.getItem() == currentService) {
                                playTvHandler.focus = 1;
                                return;
                            }
                            playTvHandler.service = playTvChannelListObj.listObj.getItem();
                            changeTvMode = "05";
                            playTvHandler.setFocusState(1);
                            playServiceById(playTvChannelListObj.listObj.getItem().logicalChannelId, 0);
                            break;
                        case KEY_BACK:
                        case KEY_EXIT:
                            this.hide();
                            break;
                        case KEY_VOLUME_DOWN:
                        case KEY_VOLUME_UP:
                            this.hide();
                            if (volumebar) {
                                if (val == KEY_VOLUME_DOWN) {
                                    volumebar.volumeDown(currentService, {
                                        curService: currentService,
                                        code: "45",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                } else {
                                    volumebar.volumeUp(currentService, {
                                        curService: currentService,
                                        code: "61",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                }
                                ADContrl.switchVolumebarImg();
                            }
                            break;
                        case KEY_MUTE:
                            if (volumebar) {
                                volumebar.muteFunc();
                            }
                            break;
                        default:
                            return true;
                            break;
                    }
                }
            };

            playTvChannelListObj.createPlayTvList();
            playTvListHandler.hide();
			setTimeout(function () {
                SumaJS.eventManager.addEventListener("playTvListHandler", playTvListHandler, 10);
			}, 200);
            /****************************************频道列表控制 END**************************************/
            /**************************************** 二级更多列表控制**************************************/
           	var playTvSecondMenuListObj,playTvSecondMenuListHandler;
        function playTvSecondMenuListFun(){
           	playTvSecondMenuListObj = new function () {
                var self = this;
                this.secondMenuList = null;
                this.createSecondMenuList = function () {
                    var secondMenuNames = [];
                    for (var i = 0; i < 4; i++) {
                        secondMenuNames.push(SumaJS.getDom("play_second_menu_list_name_" + i));
                    }
                    var cfg = {
                        index: 0,
                        items: [{name: "排行", useable: true}, {name: "常看", useable: true},
                            {name: "回看", useable: true}, {name: "连看", useable: true}],
                        pageSize: 4,
                        type: 1,
                        uiObj: {
                            nameArray: secondMenuNames,
                            focusBg: SumaJS.getDom("play_second_menu_list_focus")
                        },
                        showData: function (dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                            if (isUpdate) {
                                if (!dataObj) {
                                    for (var i = 0; i < uiObj.nameArray.length; ++i) {
                                        uiObj.nameArray[i].innerHTML = "";
                                    }
                                    uiObj.focusBg.style.top = 0 + "px";
                                    uiObj.focusBg.style.display = "none";
                                } else {
                                    uiObj.focusBg.style.display = "block";
                                    for (var i = 0; i < uiObj.nameArray.length; ++i) {
                                        uiObj.nameArray[i].className = "play_second_menu_list_name_nofocus";
                                        uiObj.nameArray[i].style.color = "#8b9299";
                                        if (dataObj[i]) {
                                            uiObj.nameArray[i].innerHTML = dataObj[i].name;
                                        } else {
                                            uiObj.nameArray[i].innerHTML = "";
                                        }
                                    }
                                    // if (!playTvChannelListObj.timeshiftFlag) {
                                    //     uiObj.nameArray[3].style.color = "#5d6166";
                                    //     dataObj[3].useable = false;
                                    // } else {
                                    //     dataObj[3].useable = true;
                                    // }
                                }
                            } else if (lastFocusPos > -1) {
                                uiObj.nameArray[lastFocusPos].className = "play_second_menu_list_name_nofocus";
                                uiObj.nameArray[lastFocusPos].style.color = "#8b9299";
                                uiObj.nameArray[lastFocusPos].innerHTML = dataObj[lastFocusPos].name;
                            }
                            if (focusPos > -1) {
                                uiObj.focusBg.style.top = 135 + focusPos * 47 + "px";
                                uiObj.nameArray[focusPos].style.color = "#FFFFFF";
                                uiObj.nameArray[focusPos].className = "play_second_menu_list_name_focus";
                                self.setGetFocusStyle();
                            }
                        },
                        onSelect: function (index) {
                            createMenu(self.secondMenuList.getIndex());
                        }
                    };
                    this.secondMenuList = new SubList(cfg);
                };
                this.setGetFocusStyle = function () {
                    SumaJS.getDom("play_second_menu_list").style.background = 'url("images/play/second_menu_list_bg_focus.png") no-repeat';
                    this.secondMenuList.uiObj.nameArray[this.secondMenuList.focusPos].style.backgroundColor = "";
                };
                this.setLoseFocusStyle = function () {
                    //this.secondMenuList.uiObj.nameArray[this.secondMenuList.focusPos].style.color = "#FFFFFF";
                    //this.secondMenuList.uiObj.nameArray[this.secondMenuList.focusPos].style.backgroundColor = "rgba(63, 77, 110, 0.8)";
					this.secondMenuList.uiObj.nameArray[this.secondMenuList.focusPos].style.backgroundColor = "rgba(116, 140, 194, 0.15)";
                    this.secondMenuList.uiObj.focusBg.style.display = "none";
                    SumaJS.getDom("play_second_menu_list").style.background = 'url("images/play/second_menu_list_bg_blur.png") no-repeat';
                };
            };
            playTvSecondMenuListHandler = {
                focus: 0,
                hideTime: 5000,
                showTimer: -1,
                right: function () {
                },
                left: function () {
                    this.hide();
                    playTvListHandler.show();
                },
                up: function () {
                    //playTvSecondMenuListObj.secondMenuList.up();
                    jumpToUseable(playTvSecondMenuListObj.secondMenuList, "up");
                },
                down: function () {
                    //playTvSecondMenuListObj.secondMenuList.down();
                    jumpToUseable(playTvSecondMenuListObj.secondMenuList, "down");
                },
                pageUp: function () {
                },
                pageDown: function () {
                },
                show: function () {
                    chanNumObj.hidden();
                    playTvHandler.setFocusState(0);
                    playTvListHandler.focus = 0;
                    volumebar.setFocusState(0);
                    SumaJS.getDom("play_second_menu_list").style.display = "block";
                    playTvSecondMenuListObj.secondMenuList.resetData();
                    this.focus = 1;

                },
                hide: function () {
                    this.focus = 0;
                    SumaJS.getDom("play_second_menu_list").style.display = "none";
                    SumaJS.getDom("play_second_menu_list_focus").style.display = "none";
                },
                hideTimer: function () {
                },
                setFocusState: function (state) {
                    if (state) {
                        this.focus = 1;
                        this.show();
                    } else {
                        this.focus = 0;
                    }
                },
                eventHandler: function (event) {
                    var val = event.keyCode || event.which;
                    SumaJS.debug("====playtv playTvSecondMenuListHandler get msg=== which[" + val + "]");
                    if (!this.focus) {
                        return true;
                    }
                    switch (val) {
                        case KEY_LEFT:
                        case KEY_BACK:
                            this.left();
                            break;
                        case KEY_UP:
                            this.up();
                            break;
                        case KEY_DOWN:
                            this.down();
                            break;
                        case KEY_RIGHT:
                            // alert(eventDateList.getItems().length);
                        case KEY_ENTER:
                            if(playTvSecondMenuListObj.secondMenuList.getIndex()== 2 && playTvChannelListObj.listObj.getItem().playback == 0){
                                showPlayTipMsgBox("此频道不是时移频道，暂不支持回看","play_tip_box2");
                                setTimeout(function () {
                                    SumaJS.msgBox.removeMsg("play_tip_box2");
                                }, 2000);
                                eventsContentList.hide();
                                eventDateList.hide();
                                break;
                            }else{
                            playTvSecondMenuListObj.secondMenuList.select();							
							////add by liwenlei 添加数据采集
							var thisType = SumaJS.padString(playTvSecondMenuListObj.secondMenuList.getIndex()+1,0,2);
							//DataCollection.collectData(["0x1a",thisType,val]);
							DataCollection.collectData(["1a",thisType,val]);
                            break;
                            }
                        case KEY_EXIT:
                            this.hide();
                            playTvListHandler.hide();
                            break;
                        case KEY_VOLUME_DOWN:
                        case KEY_VOLUME_UP:
                            this.hide();
                            playTvListHandler.hide();
                            if (volumebar) {
                                if (val == KEY_VOLUME_DOWN) {
                                    volumebar.volumeDown(currentService, {
                                        curService: currentService,
                                        code: "45",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                } else {
                                    volumebar.volumeUp(currentService, {
                                        curService: currentService,
                                        code: "61",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                }
                                ADContrl.switchVolumebarImg();
                            }
                            break;
                        case KEY_MUTE:
                            if (volumebar) {
                                volumebar.muteFunc();
                            }
                            break;
                        default:
                            return true;
                            break;
                    }
                }
            };
            playTvSecondMenuListObj.createSecondMenuList();
            //setTimeout(function () {
                SumaJS.eventManager.addEventListener("playTvSecondMenuListHandler", playTvSecondMenuListHandler, 2);
            //}, 200);
        }
            function createMenu(index) {
                switch (index) {
                    case 0://排行
                        if (!UBAServerAdd) {
                            //break;
                        }
                        //屏蔽订购
                        if (channelOrderFlag) {
                            channelOrder.loseFocus();
                        }
                        playTvSecondMenuListHandler.setFocusState(0);
                        liveChannelTop.focus = 1;
                        //if(liveChannelList.getItems().length <= 0){
                        liveChannelList.resetData({index: 0, items: []});
                        SumaJS.getDom("currentchannel_top_cell2").innerHTML = "";
                        SumaJS.getDom("currentchannel_top_cell3").innerHTML = "";
                        SumaJS.getDom("currentchannel_top_cell4").innerHTML = "";
                        SumaJS.getDom("currentchannel_top_cell4").style.background = "";
                        //}
                        SumaJS.getDom("play_tv_channel_top_tip").innerHTML = "正在加载内容...";
                        playTvSecondMenuListObj.setLoseFocusStyle();
                        SumaJS.getDom("channel_top").style.display = "block";
                        liveChannelTop.get(function () {
                            liveChannelTop.show();
                        });
                        refreshChannelTopTimer = setInterval(function () {
                            liveChannelTop.get(function () {
                                liveChannelTop.show();
                            });
                        }, 10000);
                        if (currentService) {
                            //DataCollection.collectData(["04", currentService.channelId + "", currentService.serviceName, currentService.serviceId + "", currentService.networkId + "", currentService.tsInfo.TsId + "", changeTvMode, playTvStatus, "321"]);
                        }
                        break;
                    case 1://常看
                        if (favInfoBox) {
                            favInfoBox.show();
                            //屏蔽订购
                            if (channelOrderFlag) {
                                channelOrder.loseFocus();
                            }
                            playTvSecondMenuListObj.setLoseFocusStyle();
                            playTvSecondMenuListHandler.setFocusState(0);
                            //infoAd.showAd();
                            if (currentService) {
                                //DataCollection.collectData(["04", currentService.channelId + "", currentService.serviceName, currentService.serviceId + "", currentService.networkId + "", currentService.tsInfo.TsId + "", changeTvMode, playTvStatus, "73"]);
                            }
                        }
                        break;
                    case 2://回看
                        if (eventInfoBox) {
                            eventInfoBox.show();
                            eventInfoBox.focusArea = "datelist";
                            //屏蔽订购
                            //alert(currentService.playback);
                            //if(currentService.playback ==0){
                            //    eventsContentList.hide();
                            //    eventDateList.hide();
                            //    alert("本频道暂不支持回看");
                            //}else{
                            if (channelOrderFlag) {
                                channelOrder.loseFocus();
                            }
                            playTvSecondMenuListObj.setLoseFocusStyle();
                            playTvSecondMenuListHandler.setFocusState(0);
                            //infoAd.showAd();
//                          if (currentService) {
                                //DataCollection.collectData(["04", currentService.channelId + "", currentService.serviceName, currentService.serviceId + "", currentService.networkId + "", currentService.tsInfo.TsId + "", changeTvMode, playTvStatus, "73"]);
//                          }
                        }
                        break;
                    case 3://连看
                        if (relateInfoBox) {
                            relateInfoBox.show();
                            //屏蔽订购
                            if (channelOrderFlag) {
                                channelOrder.loseFocus();
                            }
                            playTvSecondMenuListObj.setLoseFocusStyle();
                            playTvSecondMenuListHandler.setFocusState(0);
                            //infoAd.showAd();
//                          if (currentService) {
                                //DataCollection.collectData(["04", currentService.channelId + "", currentService.serviceName, currentService.serviceId + "", currentService.networkId + "", currentService.tsInfo.TsId + "", changeTvMode, playTvStatus, "73"]);
//                          }
                        }
                        break;
                }
            }

            function jumpToUseable(listObj, direct) {
                var tempItems = listObj.getItems();
                var tempIndex = listObj.getIndex();
                var index = 0;
                if (direct == "right") {
                    for (var i = 0, len = tempItems.length; i < len; i++) {
                        if (tempItems[i].useable) {
                            index = i;
                            break;
                        }
                    }
                } else if (direct == "up") {
                    for (var i = tempIndex - 1; ; i--) {
                        if (i < 0) {
                            if (tempItems[tempItems.length + i].useable) {
                                index = tempItems.length + i;
                                break;
                            }
                        } else {
                            if (tempItems[i].useable) {
                                index = i;
                                break;
                            }
                        }
                    }

                } else {
                    for (var i = tempIndex + 1; ; i++) {
                        if (i >= tempItems.length) {
                            if (tempItems[i - tempItems.length].useable) {
                                index = i - tempItems.length;
                                break;
                            }
                        } else {
                            if (tempItems[i].useable) {
                                index = i;
                                break;
                            }
                        }
                    }
                }
                listObj.resetData({"index": index});
            }
		
            /****************************************二级更多列表控制 END**************************************/
           /****************************************播放控制**************************************/
            //视频画面格式
            var videoAspect = ["16:9播放模式", "4:3 combined播放模式", "4:3 Pan-Scan 播放模式", "4:3 Letter-Box 播放模式", "全屏播放模式", "自动播放模式"];
            var videoAspectIndex = 0;
            //PF信息、切台
            var playTvHandler = {
                focus: 1,
                pfTimer: -1,
                service: null,
                uiObj: {
                    name: SumaJS.getDom("play_pf_bar_channel_name"),
                    num: SumaJS.getDom("play_pf_bar_channel_num"),
                    time: SumaJS.getDom("play_pf_bar_time"),
                    container: SumaJS.getDom("play_pf_bar")
                },
                show: function () {
                    clearTimeout(this.pfTimer);
                    if (this.service) {
                        //this.uiObj.name.innerHTML = displayText(this.service.serviceName, 170, 27);
                        this.uiObj.name.innerHTML = this.service.serviceName;
                        this.uiObj.num.innerHTML = this.service.logicalChannelId;
                        this.uiObj.time.innerHTML = "报时 " + SumaJS.dateFormat(new Date(), "hh:mm");
                    }
                    volumebar.setFocusState(0);
                    if (UBAServerAdd) {
                        SumaJS.getDom("shoushi_bg").style.display = "block";
                    }
                    var searchURL = SysSetting.getEnv("PORTAL_SEARCHURL");
                    if (searchURL && searchURL.length > 0) {
                        SumaJS.getDom("sousuo_bg").style.display = "block";
                    } else {
                        SumaJS.getDom("sousuo_bg").style.display = "none";
                    }
                    this.uiObj.container.style.display = "block";
                    //SumaJS.getDom("play_bg_cover").style.display = "block";
                    SumaJS.getDom("play_pf_bar").className = "play_pf_bar_long";
                    SumaJS.getDom("pfbar_AD_0").style.display = "block";
                    var self = this;
                    self.pfTimer = setTimeout(function () {
                        self.uiObj.container.style.display = "none";
                        //SumaJS.getDom("play_bg_cover").style.display = "none";
                        SumaJS.getDom("play_pf_bar_channel_tag").style.display = "none";
                        if (currentService && currentService.playback) {
                            SumaJS.getDom("support_play_back").style.display = "block";
                            setTimeout(function () {
                                SumaJS.getDom("support_play_back").style.display = "none";
                            }, 5000);
                        }
                    }, 5000);
                },
                setFocusState: function (state) {
                    this.focus = state;
                    if (state) {
                        this.show();
                    } else {
                        clearTimeout(this.pfTimer);
                        this.uiObj.container.style.display = "none";
                    }
                },
                eventHandler: function (event) {
                    var val = event.keyCode || event.which;
                    SumaJS.debug("====playtv playTvHandler get msg=== which[" + val + "]" + "  this.focus=" + this.focus);
                    if (!this.focus) {
                        return true;
                    }
                    switch (val) {
                        case KEY_UP:
                        	channelNumIndex++;
                            if (channelNumIndex >= channelNumId.length) {
                                channelNumIndex = 0;
                            }
                            changeTvMode = "01";
                            var triggerFlag = RecLiveChannel.UpDownKeyChannelTrigger(KEY_UP);
                            if (triggerFlag) {
                                var tempChannelId = channelNumId[channelNumIndex];
                                channelNumId[channelNumIndex] = RecLiveChannel.getRecChannel(3).logicalChannelId;
                                playServiceById(channelNumId[channelNumIndex]);
                                channelNumId[channelNumIndex] = tempChannelId;
                                channelNumIndex--;
                                return;
                            }
                            playServiceById(channelNumId[channelNumIndex]);
                        	break;
                        case KEY_DOWN:
                            channelNumIndex--;
                            if (channelNumIndex < 0) {
                                channelNumIndex = channelNumId.length - 1;
                            }
                            changeTvMode = "02";
                            var triggerFlag = RecLiveChannel.UpDownKeyChannelTrigger(KEY_DOWN);
                            if (triggerFlag) {
                                var tempChannelId = channelNumId[channelNumIndex];
                                channelNumId[channelNumIndex] = RecLiveChannel.getRecChannel(3).logicalChannelId;
                                playServiceById(channelNumId[channelNumIndex]);
                                channelNumId[channelNumIndex] = tempChannelId;
                                channelNumIndex++;
                                return;
                            }
                            playServiceById(channelNumId[channelNumIndex]);
                            break;
                        case KEY_ENTER:
                        	if(playTvChannelListIs){
		                    	playTvSecondMenuListFun();
		                    	playTvChannelListIs=false;
		                    	setTimeout(function(){
			                    	eventInfos();
			                    	relateInfos();
			                    	favChannels();
			                    	liveChannels();
			                    },100)
		                    }
                            clearTimeout(this.pfTimer);
                            this.setFocusState(0);
                            try{chanNumObj.hidden();}catch(e){};
                            playTvListHandler.show();
                            if (currentService) {
                                DataCollection.collectData(["04", currentService.channelId + "", currentService.serviceName, currentService.serviceId + "", currentService.networkId + "", currentService.tsInfo.TsId + "", changeTvMode, playTvStatus, "13"]);
                            }
                            playTvChannelListObj.listObj.resetData({index: currentSerIndex, items: playTvChannelListObj.listObj.getItems()});
                            return false;
                            break;
                        case KEY_BACK:
                            if (beforLogicalChannelId) {
                                playServiceById(beforLogicalChannelId);
                            }
                            break;
                        case KEY_EXIT:
                            initPage();
                            if (SumaJS.msgBox) {
                                SumaJS.msgBox.removeMsg("ca_msg");
                                //FIXME:回到首页时如果有信号中断的框要隐藏
                                SumaJS.msgBox.removeMsg("tune_lock");
                            }              
                            if (SumaJS.lastModuleName) {
                                closeCycleControl.setIsBackToPage(1);
                                SumaJS.loadModule(SumaJS.lastModuleName);
                            } else {
                                closeCycleControl.setIsBackToPage(0);
                                SumaJS.loadModule("tv_page");
                            }
                            break;
                        case KEY_POUND: //#键切换显示比例
                            if (SumaJS.globalPlayer) {
                                //videoAspectIndex ++;
                                if (SumaJS.globalPlayer.mediaPlayer.videoAspect == 1) {
                                    videoAspectIndex = 4;
                                } else {
                                    videoAspectIndex = 1;
                                }
                                SumaJS.globalPlayer.setVideoAspect(videoAspectIndex);
                                //showPlayTipMsgBox("视频画面格式："+videoAspect[videoAspectIndex], "play_tip_box2");
                                //setTimeout(function(){SumaJS.msgBox.removeMsg("play_tip_box2");},2000);
                            }
                            break;
                        case KEY_RIGHT:
                        	if(playTvChannelListIs){
		                    	playTvSecondMenuListFun();
		                    	playTvChannelListIs=false;
		                    	setTimeout(function(){
			                    	eventInfos();
			                    	relateInfos();
			                    	favChannels();
			                    	liveChannels();
		                    	},100)
		                    }
                            playTvListHandler.show();
                            playTvChannelListObj.listObj.resetData({index: currentSerIndex, items: playTvChannelListObj.listObj.getItems()});
                            playTvListHandler.right();
                            MplayTvSecondMenuListObj.secondMenuList.resetData({index: 2});
                            break;
                        case KEY_VOLUME_DOWN:
                        case KEY_VOLUME_UP:
                            if (volumebar) {
                                if (val == KEY_VOLUME_DOWN) {
                                    volumebar.volumeDown(currentService, {
                                        curService: currentService,
                                        code: "45",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                } else {
                                    volumebar.volumeUp(currentService, {
                                        curService: currentService,
                                        code: "65",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                }
                                ADContrl.switchVolumebarImg();
                            }
                            break;
                        case KEY_MUTE:
                            if (volumebar) {
                                volumebar.muteFunc();
                            }
                            break;
                        case KEY_INFO:
                            if(playTvChannelListIs){
		                    	playTvSecondMenuListFun();
		                    	playTvChannelListIs=false;
		                    	eventInfos();
		                    	relateInfos();
		                    	favChannels();
		                    	liveChannels();
	                        }
                            //数据采集
                            DataCollection.collectData(["04", currentService.channelId + "", currentService.serviceName, currentService.serviceId + "", currentService.networkId + "", currentService.tsInfo.TsId + "", changeTvMode, playTvStatus, "73"]);

                            playTvListHandler.show();
                            playTvChannelListObj.listObj.resetData({index: currentSerIndex, items: playTvChannelListObj.listObj.getItems()});                            
                            playTvListHandler.right();
                            if (!playTvChannelListObj.timeshiftFlag) {
								showPlayTipMsgBox("此频道不是时移频道，暂不支持回看","play_tip_box2");
                                setTimeout(function () {
                                    SumaJS.msgBox.removeMsg("play_tip_box2");
                                }, 2000);
                                eventsContentList.hide();
                                eventDateList.hide();
                            } else {
                                playTvSecondMenuListObj.secondMenuList.resetData({index: 2});
                                createMenu(2);
                            }
                            break;
                        case KEY_RED:
                        	if(channelInfoIs){
                        		channelInfoFun();
                        		channelInfoIs = false;
                        	}
                            if (playCAMsg) {
                                break;
                            }
                            channelInfo.setFocusState(1);
                            if (currentService) {
                                DataCollection.collectData(["04", currentService.channelId + "", currentService.serviceName, currentService.serviceId + "", currentService.networkId + "", currentService.tsInfo.TsId + "", changeTvMode, playTvStatus, "320"]);
                            }
                            break;
                        case KEY_LEFT:
                        case KEY_YELLOW:
                        case KEY_TV:
                            toTimeShift(currentService);
                            break;
                        case KEY_GREEN:
                        	 if(playTvChannelListIs){
		                    	playTvSecondMenuListFun();
		                    	playTvChannelListIs=false;
		                    	eventInfos();
		                    	relateInfos();
		                    	favChannels();
		                    	liveChannels();
	                        }
                            //数据采集
                            DataCollection.collectData(["04", currentService.channelId + "", currentService.serviceName, currentService.serviceId + "", currentService.networkId + "", currentService.tsInfo.TsId + "", changeTvMode, playTvStatus, "" + KEY_GREEN]);

                            playTvListHandler.show();
                            playTvChannelListObj.listObj.resetData({index: currentSerIndex, items: playTvChannelListObj.listObj.getItems()});
                            playTvListHandler.right();
                            playTvSecondMenuListObj.secondMenuList.resetData({index: 0});
                            createMenu(0);
                            break;
                        case KEY_BLUE:
                            window.location.href = PORTAL_ADDR + "/NewFrameWork/web/searchEx/index.html?backUrl=main://index.html?page=play_tv";
                            /*var url = SysSetting.getEnv("PORTAL_SEARCHURL");
                             if (url) {
                             SysSetting.setEnv("PORTAL_SEARCH_BACKPAGE", "main://index.html?page=play_tv");
                             var searchUrlSequeData = JSON.parse(SysSetting.getEnv("PortalSearchUrlSequeData"));
                             DataCollection.collectData(["0a", searchUrlSequeData.sourceData[0].id, searchUrlSequeData.windowName, searchUrlSequeData.sourceData[0].name, url]);
                             //var data = portalAd.searchUrlSequeData.sourceData[0];
                             //DataCollection.collectData(["0a",data.id,portalAd.searchUrlSequeData.windowName,data.name,url]);
                             window.location.href = url + "?from=Live";
                             }*/
                            break;
                        default:
                            return false;
                            break;
                    }
                    return false;
                }
            };
            setTimeout(function () {
                SumaJS.eventManager.addEventListener("playTvHandler", playTvHandler, 101);
            }, 200);

            //频道号控制
            var chanNumObj;
            setTimeout(function(){
	            chanNumObj = {
//	                focus: 0,
	                inputStr: "",
	                currentNum: 0,
	                uiObj: SumaJS.getDom("play_tv_channel_number"),
	                hideTimer: -1,
	                hideTime: 5000,
	                input: function (num) {
	                    //屏蔽订购
	                    if (channelOrderFlag) {
	                        channelOrder.loseFocus();
	                    }
	
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
	                    SumaJS.getDom("play_tv_channel_number").style.display = "block";
	                },
	                resetNum: function (num) {
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
	                show: function () {
	                    playTvListHandler.hide();
	                    if(!playTvChannelListIs){
	                    	playTvSecondMenuListHandler.hide();
	                    	liveChannelTop.hide();
	                        favInfoBox.hide();
	                    	relateInfoBox.hide();
	                    	eventInfoBox.hide();
	                    }
//	                    this.setFocusState(1);
	                    this.uiObj.style.visibility = "visible";
	                    clearTimeout(this.hideTimer);
	                    if (this.inputStr.length == 3) {
	                        this.hideTime = 200;
	                    } else if (this.inputStr.length >= 1) {
	                        this.hideTime = 1500;
	                    } else {
	                        this.hideTime = 5000;
	                    }
	                    this.hideTimer = setTimeout(function () {
	                        chanNumObj.hidden();
	                    }, chanNumObj.hideTime)
	                },
	                hidden: function () {
	                    clearTimeout(this.hideTimer);
	                    this.uiObj.style.visibility = "hidden";
	                    var channelIndex = this.inputStr;
	                    this.inputStr = "";
	                    if (channelIndex) {
	                        changeTvMode = "03";
	                        playServiceById(channelIndex);
	                    } 
	                },
	                selected: function () {
	                    if (this.inputStr.length > 0) {
	                        clearTimeout(this.hideTimer);
	                        channelNumIndex = -1;
	                        changeTvMode = "03";
	                        playServiceById(this.inputStr);
	                        this.inputStr = "";
	                        return false;
	                    } else {
	                        return true;
	                    }
	                },
//	                setFocusState: function (state) {
//	                    this.focus = state;
//	                },
	                eventHandler: function (event) {
	                    var val = event.keyCode || event.which;
	                    SumaJS.debug("====playtv chanNumObj get msg=== which[" + val + "]");
//	                    if (!this.focus) {	
//	                        return true;
//	                    }
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
	            };
//	            setTimeout(function () {
	            SumaJS.eventManager.addEventListener("chanNumObj", chanNumObj, 95);
//	            }, 200);
            },500);
            /****************************************播放控制 END**************************************/

            /****************************************音量控制**************************************/

            var uiObj = {
                volumebar: SumaJS.getDom("play_tv_volume_bar"),
                volumeProgress: SumaJS.getDom("play_tv_volume_bar_progress"),
                volumeRight: SumaJS.getDom("play_tv_volume_bar_progress_point"),
                volumeValue: SumaJS.getDom("play_tv_volume_bar_num"),
                mute: SumaJS.getDom("play_tv_mute")
            };

            var cfg = {
                minVolume: 0,
                maxVolume: 32,
                uiObj: uiObj,
                player: SumaJS.globalPlayer.mediaPlayer,
                volumebarAd: SumaJS.getDom("play_tv_volume_bar_ad"),
                onUIAdapter: function (dataObj, uiObj) {
                    if (typeof dataObj.mute != "undefined" && dataObj.mute == 1) {
                        uiObj.mute.style.display = "block";
                    } else if (typeof dataObj.mute != "undefined" && dataObj.mute == 0) {
                        uiObj.mute.style.display = "none";
                    }
                    if (dataObj.showFlag) {
                        uiObj.volumeValue.innerHTML = dataObj.value;
                        //var width = 768 / 32 * dataObj.value;
                        var width = 24 * dataObj.value;
                        uiObj.volumeProgress.style.width = width + "px";
                        //uiObj.volumeRight.style.left = (82 + width - 5) + "px";
                        uiObj.volumebar.style.display = "block";
                        uiObj.volumeRight.style.display = "block";
                        playTvHandler.uiObj.container.style.display = "none";
                        this.focus = 1;
                    } else {
                        uiObj.volumebar.style.display = "none";
                        uiObj.volumeRight.style.display = "none";
                        this.focus = 0;
                    }
                },
                onEventHandler: function (event) {
                    if (this.focus) {
                        var val = event.keyCode || event.which;
                        switch (val) {
                            case KEY_VOLUME_UP:
                                this.volumeUp(currentService, {
                                    curService: currentService,
                                    code: "61",
                                    mode: changeTvMode,
                                    status: playTvStatus
                                });
                                break;
                            case KEY_VOLUME_DOWN:
                                this.volumeDown(currentService, {
                                    curService: currentService,
                                    code: "45",
                                    mode: changeTvMode,
                                    status: playTvStatus
                                });
                                break;
                            case KEY_MUTE:
                                this.muteFunc();
                                break;
                            case KEY_EXIT:
                            case KEY_UP:
                            case KEY_DOWN:
                                this.hide();
                                playTvHandler.focus = 1;
                                return true;
                                break;
                            case KEY_ENTER:
                                this.hide();
                                playTvListHandler.show();
                                return false;
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
            };
            var volumebar = new VolumeBar(cfg);
            volumebar.setFocusState(0);
            SumaJS.eventManager.addEventListener("volumebar", volumebar, 98);
            /****************************************音量控制 END**************************************/

            var lastPlayTime = 0;   //上次播放时间（单位毫秒）
            function playServiceById(id_in) {
                if (!parseInt(id_in, 10)) {
                    return;
                }
                var id = SumaJS.padString(id_in, "0", 3);
                if (currentService) {
                    if (currentService.logicalChannelId == id && !playFirst) {
                        //恢复订购
                        if (channelOrderFlag) {
                            var temp_status1 = channelOrder.alertDom ? channelOrder.alertDom.style.display : "none";
                            var temp_status2 = channelOrder.orderSelectDom ? channelOrder.orderSelectDom.style.display : "none";
                            if (temp_status1 == "block" || temp_status2 == "block") {
                                channelOrder.getFocus();
                            }
                        }
                        return;
                    }
                    playFirst = false;
                }
                //全部频道查找
                var tempIndex = -1;
                var currItems = playTvChannelListObj.listObj.getItems();
                for (var i = 0, len = currItems.length; i < len; i++) {
                    var aa = SumaJS.padString(currItems[i].logicalChannelId, "0", 3);
                    if (aa == id) {
                        tempIndex = i;
                        break;
                    }
                }
                if (tempIndex == -1) {
                    showPlayTipMsgBox("对应频道不存在", "play_tip_box2");
                    //chanNumObj.hidden();
                    setTimeout(function () {
                        SumaJS.msgBox.removeMsg("play_tip_box2");
                    }, 2000);
                    //恢复订购
                    if (channelOrderFlag) {
                        var temp_status1 = channelOrder.alertDom ? channelOrder.alertDom.style.display : "none";
                        var temp_status2 = channelOrder.orderSelectDom ? channelOrder.orderSelectDom.style.display : "none";
                        if (temp_status1 == "block" || temp_status2 == "block") {
                            channelOrder.getFocus();
                        }
                    }
                    return;
                }

                currentSerIndex = tempIndex;
                playTvChannelListObj.listObj.resetData({index: currentSerIndex, items: serviceInfo});
                playTvHandler.service = playTvChannelListObj.listObj.getItem();
                playTvHandler.setFocusState(1);

                //比较切台速度，如果快速切台则延时播放，保证正常切台
                var mtime = (new Date()).getTime();
                var delayTime = 100;
                if (mtime - lastPlayTime < 600) {
                    delayTime = 600;
                }
                lastPlayTime = mtime;
                playCurrentService(playTvHandler.service, delayTime);
            }

            playFunc = playServiceById;

            /***************epg pf*********************/
            var cfg = {
                onSearchSuccess: function (array, mask) {
                    if (!mask || mask == 0x01) {
                        //默认返回数据 PF 信息
                        PFInfo.endGetPF(array);
                    } else if (mask == 0x02 && eventInfoBox.focus == 1) {
                        PFInfo.endGetPF(array);
                    }
                },
                onSearchTimeout: null,
                onSearchExceedMaxCount: null
            };
            cfg.onSearchExceedMaxCount = cfg.onSearchSuccess;
            cfg.onSearchTimeout = cfg.onSearchSuccess;
            var epg = new EPGControl(cfg);
            SumaJS.eventManager.addEventListener("play_tv_epg", epg, 55);
            var PFInfo = {
                clearTime: 2,
                retryCount: 0,
                epgControl: null,
                type: 0x01,
                service: null,
                overTimeFlag: false,
                overTimer: null,
                getTimeout: 10,
                init: function (epgv) {
                    this.epgControl = epgv;
                },
                reset: function () {
                    this.retryCount = 0;
                },
                startGetPF: function (service) {
                    this.retryCount++;
                    this.overTimeFlag = false;
                    this.service = service;
                    this.getTimeout = this.type == 0x02 ? 20 : 10;
                    //this.clearTime = this.type==0x02?2:10;
                    this.epgControl.searchByService(this.service, this.type, this.getTimeout);
                    
                    var self = this;
                    clearTimeout(self.overTimer);
                    this.overTimer = setTimeout(
                        function () {
                            self.overTimeFlag = true;
                            if (self.type == 0x01) {
                                self.showPF([null, null]);
                                
                            } else if (self.type == 0x02) {
                                self.showPF([]);
                            }
                        }, self.getTimeout * 1000);
                },
                endGetPF: function (array) {
                    if (this.overTimeFlag) {
                        return;
                    }
                    if (this.retryCount >= this.clearTime) {
                        this.showPF(array);
                    } else {
                        if ((this.type == 0x01 && (!array[0] || !array[1])) || (this.type == 0x02 && !array[0])) {
                            this.startGetPF(this.service);
                        } else {
                            this.showPF(array);
                        }
                    }
                },
                showPF: function (array) {
                    clearTimeout(this.overTimer);
                    if (channelLock) {
                        return;
                    }
                    this.retryCount = 0;
                    if (this.type == 0x01) {
                        var p = array[0];
                        var f = array[1];
                        if (p) {
                            SumaJS.getDom("play_pf_info_p_time").innerHTML = "正播 " + p.startTime.substring(0, 5);
                            SumaJS.getDom("play_pf_info_p_name").innerHTML = displayText(p.eventName, 270, 26);
                            var start = p.startDate.replace(/-/g, "/") + " " + p.startTime;
                            var end = p.endDate.replace(/-/g, "/") + " " + p.endTime;
                            var progress = ((new Date()).getTime() - (new Date(start)).getTime()) / ((new Date(end)).getTime() - (new Date(start)).getTime());
                            if (progress > 1) {
                                progress = 1;
                            }
                            var progressWidth = SumaJS.getDom("play_pf_bar").offsetWidth > 650 ? 750 : 555;
                            SumaJS.getDom("play_pf_progress").style.width = progressWidth * progress + "px";
                        } else {
                            SumaJS.getDom("play_pf_info_p_time").innerHTML = "正播 " + "00:00";
                            SumaJS.getDom("play_pf_info_p_name").innerHTML = "未知节目";
                            SumaJS.getDom("play_pf_progress").style.width = "0px";
                        }
                        if (f) {
                            SumaJS.getDom("play_pf_info_f_time").innerHTML = "下节 " + f.startTime.substring(0, 5);
                            SumaJS.getDom("play_pf_info_f_name").innerHTML = displayText(f.eventName, 270, 26);
                        } else {
                            SumaJS.getDom("play_pf_info_f_time").innerHTML = "下节 " + "00:00";
                            SumaJS.getDom("play_pf_info_f_name").innerHTML = "未知节目";
                        }
                    } else if (this.type == 0x02) {
                        currChannelEvent = array;
                        refreshEventList();
                    }
                }
            };
            PFInfo.init(epg);
            /***************epg pf END*****************/

            playTimer = -1;
            var analysisTimer = -1;
            var pause1Flag = false;
            var channelLock = false;

            function playCurrentService(service, delayTime) {
                clearTimeout(playTimer);
                try{
	                if (channelInfo) {
	                    channelInfo.setFocusState(0);
	                }
                }catch(e){}
                if (!service) {
                    SumaJS.globalPlayer.pause(0);
                    currentService = null;
                    return;
                }
                if(freePreviewFlag == true){
                    freePreviewTipsControls.show();
                }else{
                    freePreviewTipsControls.hide();//add by linianzu
                }
                freePreviewFlag = false;
                SumaJS.getDom("play_tv_channel_number").style.display = "none";
                try{
                	chanNumObj.resetNum(service.logicalChannelId);
                }catch(e){
                	setTimeout(function(){
                		chanNumObj.resetNum(service.logicalChannelId);
                	},600);
                };
                /*if(rojaoAdv.isEnable()){
                 rojaoAdv.checkAdvBinding(service.networkId, service.tsInfo.TsId, service.serviceId);
                 }*/
                if (SysSetting.sendAppEvent) {
                    SysSetting.sendAppEvent(21003, JSON.stringify({"CurrentInfo": [service.networkId, service.tsInfo.TsId, service.serviceId]}), 0, 0);
                }
                if (service.favorite) {
                    SumaJS.getDom("play_love").style.display = "block";
                } else {
                    SumaJS.getDom("play_love").style.display = "none";
                }
                //前面板显示
                if (service.serviceType == 2) {
                    StbFrontPanel.displayText("A" + service.logicalChannelId);
                } else {
                    StbFrontPanel.displayText("C" + service.logicalChannelId);
                }
                /*if (false && service.lock == 1 && !isTempUnLock(service)) {//一期去除频道加锁
                    channelLock = true;
                    SumaJS.getDom("play_lock").style.display = "block";
                    SumaJS.getDom("play_pf_info_p_time").innerHTML = "";
                    SumaJS.getDom("play_pf_info_p_name").innerHTML = "频道已加锁";
                    SumaJS.getDom("play_pf_info_f_time").innerHTML = "";
                    SumaJS.getDom("play_pf_info_f_name").innerHTML = "";
                    SumaJS.getDom("play_pf_progress").style.width = "0px";
                    if (SumaJS.msgBox) {
                        SumaJS.msgBox.removeMsg("play_tip_box1");
                        SumaJS.msgBox.removeMsg("ca_msg");
                    }
                    if (channelOrderFlag) {
                        channelOrder.exit();
                    }
                    SumaJS.globalPlayer.pause(0);
                    showPasswordBox();
                    currentService = service;
                    ChannelChange(service);
                    return;
                }*/
                OffChannelObj.saveOffChannelToM(service);
                channelLock = false;
                if (playCAMsg) {
                    SumaJS.globalPlayer.pause(0);
                }
                if (pause1Flag) {
                    SumaJS.globalPlayer.pause(1);
                } else {
                    pause1Flag = true;
                }
                SumaJS.getDom("play_lock").style.display = "none";
                if (passwordBox) {
                    passwordBox.setFocusState(0);
                }
                if (typeof delayTime == "undefined") {
                    delayTime = 0;
                }
                SumaJS.getDom("support_play_back").style.display = "none";
                //SumaJS.getDom("play_bg_cover").style.display = "block";
                SumaJS.getDom("play_pf_bar_channel_tag").style.display = "block";
                //清除上个节目的PF信息
                SumaJS.getDom("play_pf_info_p_time").innerHTML = "正播 " + "00:00";
                SumaJS.getDom("play_pf_info_p_name").innerHTML = "正在加载...";
                SumaJS.getDom("play_pf_progress").style.width = "0px";
                SumaJS.getDom("play_pf_info_f_time").innerHTML = "下节 " + "00:00";
                SumaJS.getDom("play_pf_info_f_name").innerHTML = "正在加载...";
                ChannelChange(service);
                playTimer = setTimeout(function () {
                    playSuccess = false;
                    //如果上一个频道时音频，不进行记录
                    if (currentService && currentService.serviceType != 2) {
                        beforLogicalChannelId = currentService.logicalChannelId;
                    }
                    //if(currentService != service){
                    currentService = service;
                    playTvStatus = "00";
                    var tmppid = -1;
                    if (typeof(STrack) != "undefined") {
                        tmppid = STrack.getLastAudioPid(currentService);
                    }
                    if (tmppid > 0) {
                        currentService.currentAudioPid = tmppid;
                    }
                    SumaJS.globalPlayer.playService(currentService);
                    setMediaplayer(2);
                    volumebar.initChannelVolume(currentService);
                    //}
                    DVB.tune(currentService.tsInfo.Frequency, currentService.tsInfo.SymbolRate, currentService.tsInfo.Modulation);
                    if (currentService.lock == 0) {
                        PFInfo.reset();
                        PFInfo.type = 0x01;
                        PFInfo.startGetPF(currentService);
                    }
                    OffChannelObj.saveOffChannel(currentService);
                    ///alert(JSON.stringfy(currentService));
                }, delayTime);
                smallHomeVideo.setIsPlayingNvod(false);//将正播nvod标志位更改
                ADContrl.refreshADByService(service.networkId, service.tsInfo.TsId, service.serviceId);
            }

            function setMediaplayer(type) {
                if (SumaJS.globalPlayer && type == 2) {
                    SumaJS.globalPlayer.setFocusState(1);
                } else if (!SumaJS.globalPlayer && type == 1) {
                    SumaJS.createPlayer();
                }
                setTimeout(function () {
                    SumaJS.globalPlayer.setVideoDisplayArea("1, 0, 0, 0, 0");
                }, 10);
            }

            function showPlayTipMsgBox(msg, name) {
                var retCfg = {
                    name: name,
                    priority: 15 - parseInt(name.substr(name.length - 1)),
                    boxCss: "info" + name.substr(name.length - 1),
                    titleObj: {
                        title: "",
                        style: "title"
                    },
                    msgObj: {
                        msg: msg,
                        css: "msg_box1"
                    },
                    eventHandler: function (event) {
                        if (this.focus && event.source != 1001) {
                            var val = event.keyCode || event.which;
                            switch (val) {
                                //case KEY_BACK:
                                //this.removeMsg(name);
                                //  break;
                                default:
                                    return true;
                            }
                            return false;
                        } else {
                            return true;
                        }
                    }
                };
                SumaJS.showMsgBox(retCfg);
            }
		
            /***************************************** 回看节目控制 START ****************************************/
            var testTop = "0px";
            var eventsDateCfg,eventDateList,eventTime,eventName,eventFlag;
            var eventsContentListCfg,eventsContentList,eventInfoBox,timeShiftEventFlag,ajaxRecord;
         function  eventInfos(){   
            eventsDateCfg = {
                index: 0,
                items: [],
                pageSize: 7,
                type: 1,
                uiObj: {
                    idArray: [
                        SumaJS.getDom("play_tv_info_date0"),
                        SumaJS.getDom("play_tv_info_date1"),
                        SumaJS.getDom("play_tv_info_date2"),
                        SumaJS.getDom("play_tv_info_date3"),
                        SumaJS.getDom("play_tv_info_date4"),
                        SumaJS.getDom("play_tv_info_date5"),
                        SumaJS.getDom("play_tv_info_date6")
                    ],
                    focusBg: SumaJS.$("#play_tv_info_date_focus")
                },
                showData: function (dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                    if (!dataObj) {
                        for (var i = 0; i < uiObj.idArray.length; ++i) {
                            uiObj.idArray[i].innerHTML = "";
                        }
                        uiObj.focusBg.style.top = 0 + "px";
                        uiObj.focusBg.style.display = "none";
                    } else {
                        if (isUpdate) {
                            for (var i = 0; i < uiObj.idArray.length; ++i) {
                                uiObj.idArray[i].style.fontSize = "20px";
                                uiObj.idArray[i].style.color = "#8b9299";
                                if (dataObj[i]) {
                                    uiObj.idArray[i].innerHTML = dataObj[i].datestr;
                                } else {
                                    uiObj.idArray[i].innerHTML = "";
                                }
                            }
                            uiObj.focusBg.style.display = "block";
                        } else if (lastFocusPos > -1) {
                            uiObj.idArray[lastFocusPos].style.fontSize = "20px";
                            uiObj.idArray[lastFocusPos].style.color = "#8b9299";
                        }
                        if (focusPos > -1) {
                            uiObj.focusBg.style.top = 88 + focusPos * 47.333 + "px";
                            uiObj.idArray[focusPos].style.fontSize = "22px";
                            uiObj.idArray[focusPos].style.color = "#FFFFFF";
                        }
                    }
                    uiObj.focusBg.style.display = (eventInfoBox.focusArea === "datelist") ? "block" : "none";
                },
            };
            eventDateList = new SubList(eventsDateCfg);
            eventDateList.setLoseFocusStyle = function () {
                //this.uiObj.idArray[this.focusPos].style.backgroundColor = "rgba(63, 77, 110, 0.8)";
                this.uiObj.idArray[this.focusPos].style.backgroundColor = "rgba(116, 140, 194, 0.15)";
				SumaJS.getDom("play_tv_date_list").style.background = 'url("images/play/third_menu_list_blur2.png") no-repeat';
            }
            eventDateList.setGetFocusStyle = function () {
                this.uiObj.idArray[this.focusPos].style.backgroundColor = "";
                SumaJS.getDom("play_tv_date_list").style.background = 'url("images/play/third_menu_list_focus2.png") no-repeat';
            }

            eventTime = [];
            eventName = [];
            eventFlag = [];
            for (var i = 0; i < 11; i++) {
                eventTime.push(SumaJS.getDom("play_tv_info_event_time" + i));
                eventName.push(SumaJS.getDom("play_tv_info_event_name" + i));
                eventFlag.push(SumaJS.getDom("play_tv_info_event_flag" + i));
            }

            eventsContentListCfg = {
                index: 0,
                items: [],
                //type: 5,
                type: 1,
                pageSize: 11,
                uiObj: {
                    eventTime: eventTime,
                    eventName: eventName,
                    eventFlag: eventFlag,
                    itemArray: SumaJS.$(".play_tv_info_event_item"),
                    focusBg: SumaJS.getDom("play_tv_info_event_focus"),
                    scrollBg: SumaJS.getDom("play_tv_info_event_scroll")
                },
                showData: function (dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                    if (isUpdate) {
                        if (!dataObj) {
                            for (var i = 0; i < uiObj.eventTime.length; ++i) {
                                uiObj.eventTime[i].innerHTML = "";
                                uiObj.eventTime[i].className = "play_tv_info_event_time";
                                uiObj.eventName[i].innerHTML = "";
                                uiObj.eventFlag[i].style.background = "url()";
                            }
                            uiObj.scrollBg.style.top = "-9px";
                            uiObj.focusBg.style.top = "220px";
                            uiObj.focusBg.style.display = "none";
                        } else {
                            uiObj.focusBg.style.display = "block";
                            for (var i = 0; i < uiObj.eventTime.length; ++i) {
                                thirdListStyleControl.setStyleLoseFocus(uiObj.eventName[i]);
                                thirdListStyleControl.setStyleLoseFocus(uiObj.eventTime[i]);
                                if (dataObj[i]) {
                                    if (typeof dataObj[i].startDateTime != "undefined") {
                                        uiObj.eventTime[i].innerHTML = dataObj[i].startDateTime.split(" ")[1].substring(0, 5);
                                        uiObj.eventName[i].innerHTML = dataObj[i].programName;
                                    } else {
                                        uiObj.eventTime[i].innerHTML = dataObj[i].startTime.substring(0, 5);
                                        uiObj.eventName[i].innerHTML = dataObj[i].eventName;
                                    }
									
									//test
									//uiObj.eventFlag[i].style.background = "url(images/icon/relate_icon.png) center no-repeat";
                                    if (dataObj[i].HasRelate && dataObj[i].HasRelate == "1") {
                                        uiObj.eventFlag[i].style.background = "url(images/icon/relate_icon.png) center no-repeat";
                                        uiObj.eventFlag[i].style.backgroundSize = "";
                                    } else {
                                        uiObj.eventFlag[i].style.background = "url( )";
                                    }
                                    //if (dataObj[i].timeFlag == "start") {
                                    //    uiObj.eventTime[i].className = "play_tv_info_event_time_start";
                                    //} else if (dataObj[i].timeFlag == "end") {
                                    //    uiObj.eventTime[i].className = "play_tv_info_event_time_end";
                                    //} else {
                                    //    uiObj.eventTime[i].className = "play_tv_info_event_time";
                                    //}
                                    uiObj.eventTime[i].className = "play_tv_info_event_time";
                                } else {
                                    uiObj.eventTime[i].innerHTML = "";
                                    uiObj.eventTime[i].className = "play_tv_info_event_time";
                                    uiObj.eventName[i].innerHTML = "";
                                    uiObj.eventFlag[i].style.background = "url()";
                                }
                            }
                        }
                    } else if (lastFocusPos > -1) {
                        if (typeof dataObj[lastFocusPos].startDateTime != "undefined") {
                            uiObj.eventName[lastFocusPos].innerHTML = dataObj[lastFocusPos].programName;
                        } else {
                            uiObj.eventName[lastFocusPos].innerHTML = dataObj[lastFocusPos].eventName;
                        }
                        thirdListStyleControl.setStyleLoseFocus(uiObj.eventName[lastFocusPos]);
                        thirdListStyleControl.setStyleLoseFocus(uiObj.eventTime[lastFocusPos]);
                    }
                    //if (focusPos > -1 ) {
                    if (focusPos > -1 && eventInfoBox.focusArea === "eventlist") {
                        uiObj.focusBg.style.top = -15 + 47 * focusPos + "px";

                        if (this.getItems().length <= 1) {
                            uiObj.scrollBg.style.top = "-9px";
                        } else {
                            uiObj.scrollBg.style.top = (this.getIndex() / (this.getItems().length - 1)) * 518 + (-9) + "px";
                        }
                        if (typeof dataObj[focusPos].startDateTime != "undefined") {
                            //uiObj.eventName[focusPos].innerHTML = displayText(dataObj[focusPos].programName, 280, 26);
							uiObj.eventName[focusPos].innerHTML = displayText(dataObj[focusPos].programName, 230, 26);
                        } else {
                            //uiObj.eventName[focusPos].innerHTML = displayText(dataObj[focusPos].eventName, 280, 26);
							uiObj.eventName[focusPos].innerHTML = displayText(dataObj[focusPos].eventName, 230, 26);
                        }
                        thirdListStyleControl.setStyleOnFocus(uiObj.eventName[focusPos]);
                        thirdListStyleControl.setStyleOnFocus(uiObj.eventTime[focusPos]);
                    }
                    //eventsContentList.setGetFocusStyle();
                    uiObj.focusBg.style.display = (eventInfoBox.focusArea === "eventlist") ? "block" : "none";
                }
            };
            eventsContentList = new SubList(eventsContentListCfg);
            eventsContentList.setLoseFocusStyle = function () {
                SumaJS.getDom("play_tv_info_event_item").style.background = 'url("images/play/forth_menu_list_blur.png") no-repeat';
                this.upDate();
            }
            eventsContentList.setGetFocusStyle = function () {
                SumaJS.getDom("play_tv_info_event_item").style.background = 'url("images/play/forth_menu_list_focus.png") no-repeat';
                this.upDate();
            }

            //节目信息控制
            eventInfoBox = {
                focus: 0,
                focusArea: "datelist",
                boxContainer: SumaJS.getDom("play_tv_info_list"),
                titleDom: SumaJS.getDom("play_tv_info_list_title"),
                timeShift: 0,
                getTimeShiftEpg: function () {
                    SumaJS.getDom("play_tv_info_event_tip").innerHTML = "正在加载内容...";
                    timeShiftEvent = [];
                    currChannelEvent = [];
                    eventsContentList.resetData({index: 0, items: []});
                    if (eventDateList.getIndex() > 6) {
                        JSDataAccess.setInfo({
                            "className": "DVBSetting",
                            "info": "EPGStartDate",
                            "value": (eventDateList.getIndex() - 6) + ""
                        });
                        PFInfo.reset();
                        PFInfo.type = 0x02;
                        PFInfo.startGetPF(currentService);
                    } else if (eventDateList.getIndex() == 6) {
                        if (this.timeShift) {
                            JSDataAccess.setInfo({"className": "DVBSetting", "info": "EPGStartDate", "value": "0"});
                            getTimeShiftEvent();
                        } else {
                            JSDataAccess.setInfo({"className": "DVBSetting", "info": "EPGStartDate", "value": "6"});
                            PFInfo.reset();
                            PFInfo.type = 0x02;
                            PFInfo.startGetPF(currentService);
                        }
                    } else if (eventDateList.getIndex() < 6) {
                        if (this.timeShift) {
                            getTimeShiftEvent();
                        } else {
                            JSDataAccess.setInfo({
                                "className": "DVBSetting",
                                "info": "EPGStartDate",
                                "value": eventDateList.getIndex() + ""
                            });
                            PFInfo.reset();
                            PFInfo.type = 0x02;
                            PFInfo.startGetPF(currentService);
                        }
                    }
                },
                dateListUp: function () {
                    eventDateList.up();
                    this.getTimeShiftEpg();
                },
                dateListDown: function () {
                    eventDateList.down();
                    this.getTimeShiftEpg();
                },
                dateListRight: function () {
                    eventDateList.setLoseFocusStyle();
                    this.focusArea = "eventlist";
                    eventsContentList.setGetFocusStyle();
                    SumaJS.$("#play_tv_info_date_focus").style.display = "none";
                    SumaJS.$("#play_tv_info_event_focus").style.display = "block";
                    if(eventDateList.getIndex() == 0 ){
                        var a1 = Math.floor(eventsContentList.getItems().length/11);
                        var focusIndex1 = eventsContentList.getItems().length - a1*11;
                        eventsContentList.setFocusPos(focusIndex1-1);
                        eventsContentList.resetData({index:eventsContentList.getItems().length-1,items:eventsContentList.getItems()});
                    }else{
                        var tempS = 0;
                        for(var j = 0; j < eventsContentList.getItems().length; j++){
                            var tempTime = eventsContentList.getItems()[j].startDateTime.split(" ")[1];
                            var tempTimeS = tempTime.substr(0, 2);
                            if (parseInt(tempTimeS, 10) >= 19) {
                                tempS = j;
                                break
                            }
                        }
                        var a3 = Math.floor(tempS/11);
                        var focusIndex3 = tempS - a3*11;
                        eventsContentList.setFocusPos(focusIndex3);
                        eventsContentList.resetData({index:tempS,items:eventsContentList.getItems()});
                    }
                },
                dateListleft: function () {
                    this.hide();
                    playTvSecondMenuListHandler.setFocusState(1);
                },
                right: function () {
                    if (eventsContentList.getItem().HasRelate && eventsContentList.getItem().HasRelate == "1") {
                        this.focusArea = "relateicon";
                        eventsContentList.uiObj.eventFlag[eventsContentList.focusPos].style.background = "url(images/icon/relate_icon_focus.png) center no-repeat";
                        eventsContentList.uiObj.eventFlag[eventsContentList.focusPos].style.backgroundSize = "85px 80px";
                        SumaJS.getDom("play_tv_info_event_focus").style.display = "none";
                    }
                },
                left: function () {
                    this.focusArea = "datelist";
                    eventsContentList.setLoseFocusStyle();
                    eventDateList.setGetFocusStyle();
                    SumaJS.$("#play_tv_info_date_focus").style.display = "block";
                    SumaJS.$("#play_tv_info_event_focus").style.display = "none";
                    refreshEventList();
                },
                up: function () {
                    eventsContentList.up();
                },
                down: function () {
                    eventsContentList.down();
                },
                pageUp: function () {
                    eventsContentList.pageUp();
                },
                pageDown: function () {
                    eventsContentList.pageDown();
                },
                relateIconUp: function () {
                    this.relateIconLeft();
                    this.up();
                    this.right();
                },
                relateIconDown: function () {
                    this.relateIconLeft();
                    this.down();
                    this.right();
                },
                relateIconRight: function () {
                },
                relateIconLeft: function () {
                    this.focusArea = "eventlist";
                    SumaJS.$("#play_tv_info_event_focus").style.display = "block";
                    eventsContentList.uiObj.eventFlag[eventsContentList.focusPos].style.background = "url(images/icon/relate_icon.png) center no-repeat";
                    eventsContentList.uiObj.eventFlag[eventsContentList.focusPos].style.backgroundSize = "";
                },
                relateIconSelected: function () {
                    SumaJS.debug(eventsContentList.getItem());
                    //数据采集
                    if (playTvChannelListObj.listObj.getItem()) {//currentService
                        var item = eventsContentList.getItem();
                        DataCollection.collectData(["13", playTvChannelListObj.listObj.getItem().channelId, "03", item.programName, "02", item.assetId, playTvChannelListObj.listObj.getItem().channelId]);//currentService
                    }
                    var url = "http://" + portalAddr + "/NewFrameWork/UE/html/evensee.html?channelId=" + playTvChannelListObj.listObj.getItem().channelId + '&InnerItemId=' + eventsContentList.getItem().InnerItemId+"&backUrl=main://index.html?page=play_tv";
                    window.location.href = url;
                },
                dealNodata: function () {
                    eventsContentList.resetData({index: 0, items: []});
                    //SumaJS.getDom("play_tv_info_event_tip").innerHTML = "暂无回看内容";
                    SumaJS.getDom("play_tv_info_event_tip").innerHTML = "正在加载内容...";
                },
                selected: function () {
                    var dateIdx = eventDateList.getIndex();
                    var index = eventsContentList.getIndex();
                    if (dateIdx <= 6 && index < timeShiftEvent.length) {
                        var timeShiftEvent1 = timeShiftEvent[eventsContentList.index];
                        //var url = "http://" + portalAddr + "/NewFrameWork/UE/html/timeplayer.html?channelId=" + currentService.channelId + '&assetId=' + timeShiftEvent1.assetId+"&backUrl=main://index.html?page=play_tv";
                        //modified by liwenlei 添加type
						var url = "http://" + portalAddr + "/NewFrameWork/UE/html/timeplayer.html?channelId=" + playTvChannelListObj.listObj.getItem().channelId +'&type=0x06' + '&assetId=' + timeShiftEvent1.assetId+"&backUrl=main://index.html?page=play_tv";//currentService
						SumaJS.debug("**********************plytv playback url = " + url);
                        window.location.href = url;
                        return;
                    } else {
                        //SumaJS.debug("#####item = "+JSON.stringify(eventsContentList.getItem()));
                        if (eventsContentList.getItem().state == 0) {
                            //JSEnvManager.setEnv("offchannel_handle",epgChannelList.getItem().serviceHandle);
                            playTvHandler.setFocusState(1);
                            this.hide();
                            return;
                        }
                        var order = eventsContentList.getItem().getOrder();
                        var isBooked = order ? 1 : 0;//0:未被预订；1：被预订
                        if (isBooked) {
                            var ret = JSOrderManager.deleteJSOrder(order);
                            if (ret == 1) {
                                eventsContentList.refresh();
                            }
                        } else {
                            var ret = JSOrderManager.addOrder(eventsContentList.getItem());
                            if (ret == 1) {     //添加预订成功
                                eventsContentList.refresh();
                                if (currentService) {
                                    DataCollection.collectData(["07", currentService.channelId + "", currentService.serviceName, currentService.serviceId + "", currentService.networkId + "", currentService.tsInfo.TsId + "", "01", eventsContentList.getItem().eventName]);
                                }
                            } else if (ret == -1) {     //添加预订冲突
                                var conflict = JSOrderManager.getConflictJSOrders();
                                var tips = "该节目与您预约的[" + conflict[0].eventName + "]有冲突，预约此节目需要删除冲突的节目。要删除冲突的节目吗？";
                                //var tips = "该节目与您预约的[" + conflict[0].whichEvent.name + "]有冲突，预约此节目需要删除冲突的节目。要删除冲突的节目吗？";
                                var cfg = {
                                    name: "order_conflict",
                                    priority: 5,
                                    boxCss: "confirm",
                                    titleObj: {
                                        title: "温馨提示",
                                        style: "title"
                                    },
                                    msgObj: {
                                        msg: tips,
                                        css: "msg_box"
                                    },
                                    okButObj: {
                                        css: "confirm_determine_btn",
                                        focus: function (theBox) {
                                            theBox.getOkButDomObj().style.backgroundImage = "url(images/message_box/determine_focus.png)";
                                        },
                                        blur: function (theBox) {
                                            theBox.getOkButDomObj().style.backgroundImage = "url(images/message_box/determine.png)";
                                        },
                                        click: function (theBox) {
                                            //SumaJS.debug("old order = "+JSON.stringify(conflict[0]))
                                            JSOrderManager.deleteJSOrder(conflict[0]);
                                            theBox.removeMsg("order_conflict");
                                            eventsContentList.refresh();
                                            eventsContentList.select();
                                            return false;
                                        }
                                    },
                                    cancelButObj: {
                                        css: "confirm_cancel_btn",
                                        focus: function (theBox) {
                                            theBox.getCancelDomObj().style.backgroundImage = "url(images/message_box/cancel_focus.png)";
                                        },
                                        blur: function (theBox) {
                                            theBox.getCancelDomObj().style.backgroundImage = "url(images/message_box/cancel.png)";
                                        },
                                        click: function (theBox) {
                                            theBox.removeMsg("order_conflict");
                                            return false;
                                        }

                                    },
                                    eventHandler: function (event) {
                                        if (this.focus && event.source != 1001) {
                                            var val = event.keyCode || event.which;
                                            switch (val) {
                                                case KEY_LEFT:
                                                    this.okButFocus();
                                                    this.cancelButBlur();
                                                    break;
                                                case KEY_RIGHT:
                                                    this.cancelButFocus();
                                                    this.okButBlur();
                                                    break;
                                                case KEY_ENTER:
                                                    this.click();
                                                    break;
                                                case KEY_MAIL:
                                                case KEY_MENU:
                                                case KEY_EPG:
                                                case KEY_FAV:
                                                case KEY_TV:
                                                    this.removeMsg("order_conflict");
                                                    return false;
                                                    break;
                                                default:
                                                    return false;
                                                    break;
                                            }
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }

                                };
                                SumaJS.showMsgBox(cfg);
                            } else if (ret == -2) {     //没有对应的业务

                            } else if (ret == -3) {     //预订空间已满
                                var cfg = {
                                    name: "order_full_tip",
                                    priority: 5,
                                    boxCss: "info",
                                    titleObj: {
                                        title: "温馨提示",
                                        style: "title"
                                    },
                                    msgObj: {
                                        msg: "预定空间已满",
                                        css: "msg_box2"
                                    },
                                    eventHandler: function (event) {
                                        if (this.focus && event.source != 1001) {
                                            var val = event.keyCode || event.which;
                                            switch (val) {
                                                case KEY_BACK:
                                                case KEY_EXIT:
                                                case KEY_ENTER:
                                                    this.removeMsg("order_full_tip");
                                                    break;
                                                case KEY_MENU:
                                                case KEY_EPG:
                                                case KEY_MAIL:
                                                case KEY_FAV:
                                                case KEY_TV:
                                                    this.removeMsg("order_full_tip");
                                                    return false;
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
                                };
                                SumaJS.showMsgBox(cfg);
                            }
                        }
                    }
                },
                show: function () {
                    this.focus = 1;
                    this.boxContainer.style.display = "block";
                    this.titleDom.innerHTML = currentService.serviceName;
                    eventsContentList.uiObj.focusBg.style.display = "none";
                    SumaJS.getDom("play_tv_info_list_desc").innerHTML = "";
                    timeShiftEvent = [];
                    currChannelEvent = [];
                    eventsContentList.resetData({index: 0, items: []});
                    if (currentService.playback) {
                        this.timeShift = 1;
                        //eventDateList.resetData({index: 3, items: getDateInfo(13)});
                        eventDateList.resetData({index: 0, items: getDateInfo(13)});
                    } else {
                        this.timeShift = 0;
                        //eventDateList.resetData({index: 3, items: getDateInfo(7)});
                        eventDateList.resetData({index: 0, items: getDateInfo(13)});
                    }
                    this.getTimeShiftEpg();
                },
                hide: function () {
                    this.focus = 0;
                    this.boxContainer.style.display = "none";
                    this.focusArea = "datelist";
                    eventDateList.setGetFocusStyle();

                    //恢复订购
                    if (channelOrderFlag) {
                        var temp_status1 = channelOrder.alertDom ? channelOrder.alertDom.style.display : "none";
                        var temp_status2 = channelOrder.orderSelectDom ? channelOrder.orderSelectDom.style.display : "none";
                        if (temp_status1 == "block" || temp_status2 == "block") {
                            channelOrder.getFocus();
                        }
                    }
                },
                eventHandler: function (event) {
                    var val = event.keyCode || event.which;
                    SumaJS.debug("====playtv eventInfoBox get msg=== which[" + val + "]");
                    if (!this.focus) {
                        return true;
                    }
                    if (val == KEY_MUTE && volumebar) {
                        volumebar.muteFunc();
                    }
                    if (this.focusArea === "datelist") {
                        switch (val) {
                            case KEY_BACK:
                            case KEY_LEFT:
                                this.dateListleft();
                                break;
                            case KEY_RIGHT:
                                this.dateListRight();
                                break;
                            case KEY_UP:
                                this.dateListUp();
                                break;
                            case KEY_DOWN:
                                this.dateListDown();
                                break;
                            case KEY_EXIT:
                            case KEY_INFO:
                                playTvHandler.focus = 1;
                                this.hide();
                                playTvSecondMenuListHandler.hide();
                                playTvListHandler.hide();
                                break;
                            case KEY_VOLUME_DOWN:
                            case KEY_VOLUME_UP:
                                playTvHandler.focus = 1;
                                this.hide();
                                playTvSecondMenuListHandler.hide();
                                playTvListHandler.hide();
                                if (volumebar) {
                                    if (val == KEY_VOLUME_DOWN) {
                                        volumebar.volumeDown(currentService, {
                                            curService: currentService,
                                            code: "45",
                                            mode: changeTvMode,
                                            status: playTvStatus
                                        });
                                    } else {
                                        volumebar.volumeUp(currentService, {
                                            curService: currentService,
                                            code: "61",
                                            mode: changeTvMode,
                                            status: playTvStatus
                                        });
                                    }
                                    ADContrl.switchVolumebarImg();
                                }
                                break;
                            case KEY_GREEN:
                                return false;
                                break;
                            default:
                                return true;
                                break;
                        }
                    } else if (this.focusArea === "eventlist") {
                        switch (val) {
                            case KEY_LEFT:
                            case KEY_BACK:
                                this.left();
                                break;
                            case KEY_RIGHT:
                                this.right();
                                break;
                            case KEY_UP:
                                this.up();
                                break;
                            case KEY_DOWN:
                                this.down();
                                break;
                            case KEY_PAGE_UP:
                                this.pageUp();
                                break;
                            case KEY_PAGE_DOWN:
                                this.pageDown();
                                break;
                            case KEY_ENTER:
                                this.selected();
                                break;
                            case KEY_EXIT:
                            case KEY_INFO:
                                playTvHandler.focus = 1;
                                this.hide();
                                playTvSecondMenuListHandler.hide();
                                playTvListHandler.hide();
                                break;
                            case KEY_VOLUME_DOWN:
                            case KEY_VOLUME_UP:
                                playTvHandler.focus = 1;
                                this.hide();
                                playTvSecondMenuListHandler.hide();
                                playTvListHandler.hide();
                                if (volumebar) {
                                    if (val == KEY_VOLUME_DOWN) {
                                        volumebar.volumeDown(currentService, {
                                            curService: currentService,
                                            code: "45",
                                            mode: changeTvMode,
                                            status: playTvStatus
                                        });
                                        ADContrl.switchVolumebarImg();
                                    } else {
                                        volumebar.volumeUp(currentService, {
                                            curService: currentService,
                                            code: "61",
                                            mode: changeTvMode,
                                            status: playTvStatus
                                        });
                                        ADContrl.switchVolumebarImg();
                                    }
                                }
                                break;
                            case KEY_GREEN:
                                return false;
                                break;
                            default:
                                return true;
                                break;
                        }
                    } else if (this.focusArea === "relateicon") {
                        switch (val) {
                            case KEY_LEFT:
                            case KEY_BACK:
                                this.relateIconLeft();
                                break;
                            case KEY_RIGHT:
                                this.relateIconRight();
                                break;
                            case KEY_UP:
                                this.relateIconUp();
                                break;
                            case KEY_DOWN:
                                this.relateIconDown();
                                break;
                            case KEY_PAGE_UP:
                                this.relateIconLeft();
                                this.pageUp();
                                this.right();
                                break;
                            case KEY_PAGE_DOWN:
                                this.relateIconLeft();
                                this.pageDown();
                                this.right();
                                break;
                            case KEY_ENTER:
                                this.relateIconSelected();
                                break;
                            case KEY_EXIT:
                            case KEY_INFO:
                                playTvHandler.focus = 1;
                                this.hide();
                                playTvSecondMenuListHandler.hide();
                                playTvListHandler.hide();
                                break;
                            case KEY_VOLUME_DOWN:
                            case KEY_VOLUME_UP:
                                playTvHandler.focus = 1;
                                this.hide();
                                playTvSecondMenuListHandler.hide();
                                playTvListHandler.hide();
                                if (volumebar) {
                                    if (val == KEY_VOLUME_DOWN) {
                                        volumebar.volumeDown(currentService, {
                                            curService: currentService,
                                            code: "45",
                                            mode: changeTvMode,
                                            status: playTvStatus
                                        });
                                    } else {
                                        volumebar.volumeUp(currentService, {
                                            curService: currentService,
                                            code: "61",
                                            mode: changeTvMode,
                                            status: playTvStatus
                                        });
                                    }
                                    ADContrl.switchVolumebarImg();
                                }
                                break;
                            case KEY_GREEN:
                                return false;
                                break;
                            default:
                                return true;
                                break;
                        }
                    }
                }
            };
            eventInfoBox.hide();
            SumaJS.eventManager.addEventListener("eventInfoBox", eventInfoBox, 90);
            epgScheduleList = eventsContentList;
			timeShiftEventFlag = false;
            ajaxRecord = {"dateIndex": -1, "overTimer": -1};
        }    
            function getDateInfo(length) {
                var dateInfo = [];
                var d = new Date();
                /*var year = d.getFullYear();
                 var month = d.getMonth();
                 var date = d.getDate();*/
                var i = 0;
                var index = 0;

                if (length == 7) {
                    for (var i = 0; i < 7; i++) {
                        var dd = new Date(d.getTime() + i * 24 * 60 * 60 * 1000);
                        var str1 = SumaJS.dateFormat(dd, "dd w");
                        //dateInfo.push(str1);
                        dateInfo.push({dateindex: i, datestr: str1});
                    }
                } else if (length == 13) {
                    for (var i = 0; i < 7; i++) {
                        var dd = new Date(d.getTime() + (i - 6) * 24 * 60 * 60 * 1000);
                        var str1 = SumaJS.dateFormat(dd, "dd w");
                        //dateInfo.unshift(str1);
                        dateInfo.unshift({dateindex: i, datestr: str1});
                    }
                }
                //var today = d.getDate() + " 今日";
				var today = SumaJS.padString(d.getDate(),0,2)  + " 今日";  //add by liwenlei 
                dateInfo[0].datestr = today;
                // var temArr = dateInfo.splice(4, 3);
                var temArr = dateInfo.splice(0, 7);
                //dateInfo.splice(0, 0, temArr[6], temArr[5], temArr[4],temArr[3],temArr[2],temArr[1],temArr[0]);
                dateInfo.splice(0, 0, temArr[0], temArr[1], temArr[2],temArr[3],temArr[4],temArr[5],temArr[6]);
                SumaJS.debug(dateInfo);
                return dateInfo;
            }
			
            function timeShiftGetEpg() {
                if (eventDateList.getIndex() == 6) {
                    JSDataAccess.setInfo({"className": "DVBSetting", "info": "EPGStartDate", "value": "0"});
                    PFInfo.reset();
                    PFInfo.type = 0x02;
                    PFInfo.startGetPF(currentService);
                    //timeShiftGetEpgTimer = setTimeout(function(){refreshEventList(2);}, 5000);
                } else {
                    refreshEventList();
                }
            }
            function getTimeShiftEvent() {
                timeShiftEventFlag = false;
                var d = new Date();
                /*var year = d.getFullYear();
                 var month = d.getMonth();
                 var date1 = d.getDate();
                 //var date = new Date(year, month, (date + eventDateList.index - 6));*/
                var dtime = d.getTime();
                var date;
                //if (eventDateList.getIndex() < 3) {
                //    date = new Date(dtime - (4 + eventDateList.getIndex()) * 24 * 60 * 60 * 1000);
                //} else {
                //    date = new Date(dtime + (3 - eventDateList.getIndex()) * 24 * 60 * 60 * 1000);
                //}
                date = new Date(dtime - eventDateList.getIndex() * 24 * 60 * 60 * 1000);
                var timeShiftUrl;
                //if (eventDateList.getIndex() == 3) {
                if (eventDateList.getIndex() == 0) {
                    timeShiftUrl = "http://" + portalAddr + "/u1/GetPrograms?client=" + CA.icNo + "&resultType=json&account=" + DataAccess.getInfo("UserInfo", "account") + "&channelIds=" + playTvChannelListObj.listObj.getItem().channelId + "&startDateTime=" + (SumaJS.dateFormat(date, "yyyy-MM-dd") + " " + "00:00:00") + "&endDateTime=" + (SumaJS.dateFormat(date, "yyyy-MM-dd") + " " + SumaJS.dateFormat(date, "hh:mm:ss"));
                } else {
                    timeShiftUrl = "http://" + portalAddr + "/u1/GetPrograms?client=" + CA.icNo + "&resultType=json&account=" + DataAccess.getInfo("UserInfo", "account") + "&channelIds=" + playTvChannelListObj.listObj.getItem().channelId + "&startDateTime=" + (SumaJS.dateFormat(date, "yyyy-MM-dd") + " " + "00:00:00") + "&endDateTime=" + (SumaJS.dateFormat(date, "yyyy-MM-dd") + " " + "23:59:59");
                }
                SumaJS.debug("**********************epg getTimeshiftEvent ajax url = " + timeShiftUrl);
                ajaxRecord.dateIndex = eventDateList.getIndex();
                var ajaxParam = {
                    url: timeShiftUrl,
                    method: "GET",
                    data: "",
                    maskId: ajaxRecord.dateIndex,
                    success: updateTimeShiftEvent,
                    failed: function (data) {
                        //alert(2+data)
                        eventInfoBox.dealNodata();
                        if (timeShiftEventFlag) {
                            return;
                        }
                        if (data.maskId == eventDateList.getIndex()) {
                            timeShiftEventFlag = true;
                            PFInfo.overTimeFlag = false;
                            timeShiftGetEpg();
                        }
                    }
                };
                SumaJS.ajax(ajaxParam);
                clearTimeout(ajaxRecord.overTimer);
                ajaxRecord.overTimer = setTimeout(function () {
                        if (timeShiftEventFlag) {
                            return;
                        }
                        timeShiftEventFlag = true;
                        PFInfo.overTimeFlag = true;
                        timeShiftGetEpg();
                    }, 5000);
            }

            function getRelateItem() {
                //var netid = DVB.currentDVBNetwork ? DVB.currentDVBNetwork.networkID : -1;
                var netid = getMainFreNetworkIDFromJson();
                var relateItemUrl = UBAServerAdd + "/uba-searchReseed/1.0/json/GetRelateItem?client=" + CA.icNo + "&resultType=json" + "&ChannelId=" + playTvChannelListObj.listObj.getItem().channelId + "&RegionCode=" + CA.regionCode + "&NetworkId=" + netid; //currentService
                SumaJS.debug("********************** getRelateItem ajax url = " + relateItemUrl);
                var ajaxParam = {
                    url: relateItemUrl,
                    method: "GET",
                    data: "",
                    success: linkTimshiftAndRelation,
                    failed: function (data) {
                        //alert(2+JSON.stringify(data))
                        SumaJS.debug("playtv getRelateItem failed");
                        refreshEventList();
                    }
                };
                SumaJS.ajax(ajaxParam);
            }

            function updateTimeShiftEvent(data) {
                if (timeShiftEventFlag) {
                    return;
                }
                var ret = data.responseText;
                //alert(1 + ret)
                SumaJS.debug("epg get timeshift event return: " + ret);
                //alert("data.maskId"+data.maskId)
                if (data.maskId == eventDateList.getIndex()) {
                    timeShiftEventFlag = true;
                    var datastr = null;
                    try {
                        datastr = eval('(' + data.responseText + ')');
                    } catch (e) {
                        SumaJS.debug("epg get timeshift event but can not parse: " + e.toString());
                        eventInfoBox.dealNodata();
                        return;
                    }
                    if (typeof datastr.code != "undefined") {
                        SumaJS.debug("get timeshift event return " + datastr.code);
                        eventInfoBox.dealNodata();
                    } else {
                        var json = datastr.program;
                        var d = new Date();
                        var dateTmp;
                        //FIXME:if not do getDateInfo(13), will be wrong
                        var index = eventDateList.getIndex();
                        //if (index < 3) {
                        //    dateTmp = new Date(d.getTime() - (4 + index) * 24 * 60 * 60 * 1000);
                        //} else {
                        //    dateTmp = new Date(d.getTime() + (3 - index) * 24 * 60 * 60 * 1000);
                        //}
                        dateTmp = new Date(d.getTime() - index * 24 * 60 * 60 * 1000);
                        var date = new Date(dateTmp.getFullYear(), dateTmp.getMonth(), dateTmp.getDate(), "00", "00", "00");
                        for (var i = 0; i < json.length; i++) {
                            if (json[i].beginTimeMill > date.getTime() && (json[i].status == 1 || json[i].status == 2)) {
                                //alert(JSON.stringify(json[i]))
                                json[i].timeFlag = "";
                                timeShiftEvent.unshift(json[i]);
                            }
                        }
                        timeShiftEvent.sort(function (a, b) {
                            return a.beginTimeMill - b.beginTimeMill;//从小到大
                            //return b.beginTimeMill - a.beginTimeMill;//从大到小
                        });
                        if (timeShiftEvent.length > 1) {
                            timeShiftEvent[0].timeFlag = "start";
                            timeShiftEvent[timeShiftEvent.length - 1].timeFlag = "end";
                        }
                        getRelateItem();
                    }
                } else {
                    timeShiftEvent = [];
                }
            }

            function linkTimshiftAndRelation(data) {
                var ret = data.responseText;
                //alert(" get RelateItem event return: " + ret);
                try {
                    var datastr = eval('(' + data.responseText + ')');
                } catch (e) {
                    SumaJS.debug(" get RelateItem parse error");
                    refreshEventList();
                    return timeShiftEvent;
                }
                if (typeof datastr.code != "undefined") {
                    SumaJS.debug(" get RelateItem " + datastr.code);
                } else {
                    var json = datastr.RelateItem;
                    for (var i = 0; i < timeShiftEvent.length; i++) {
                        var assetid = timeShiftEvent[i].assetId;
                        for (var j = 0; j < json.length; j++) {
                            if (json[j].AssetId == assetid) {
                                timeShiftEvent[i].HasRelate = json[j].HasRelate;
                                timeShiftEvent[i].InnerItemId = json[j].InnerItemId;
                                break;
                            }
                        }
                    }
                }
                refreshEventList();
                return timeShiftEvent;
            }

            function refreshEventList(type) {
                if (channelLock) {
                    return;
                }
                //clearTimeout(timeShiftGetEpgTimer);
                var eventItems = {};
                if (eventInfoBox.timeShift) {
                    var temp = timeShiftEvent;
                    eventItems = temp.concat(currChannelEvent);
                } else {
                    eventInfoBox.timeShift = 1;
                    eventItems = timeShiftEvent;
                    eventInfoBox.getTimeShiftEpg();
                    //eventItems = currChannelEvent;
                }
                if (!eventItems || eventItems.length == 0) {
                    eventsContentList.uiObj.focusBg.style.display = "none";
                    if (PFInfo.overTimeFlag) {
                        eventInfoBox.dealNodata();
                    } else {
                        if (type == 2) {
                            return;
                        }
                        eventInfoBox.dealNodata();
                    }
                    return;
                }
                SumaJS.getDom("play_tv_info_event_tip").innerHTML = "";
                eventsContentList.uiObj.focusBg.style.display = "block";
                //if (false && eventDateList.getIndex() == 6) {//暂时注释掉 == 6的特殊处理，因为不知道有什么用
                if (eventDateList.getIndex() == 0) {
                    eventsContentList.resetData({index:eventItems.length-1,items: eventItems});
                    //var tempF = 0;
                    //for (var i = 0; i < eventItems.length; i++) {
                    //    var tempBT = eventItems[i].startDateTime.split(" ")[1];
                    //    var tempBeginTimeF= tempBT.substr(0, 2);
                    //    if (parseInt(tempBeginTimeF, 10) < 19) {
                    //        eventsContentList.resetData({index:eventItems.length-1,items: eventItems});
                    //    }else if(parseInt(tempBeginTimeF, 10) >= 19) {
                    //        tempF = i;
                    //        eventsContentList.resetData({index: tempF, items:  eventItems});
                    //        break;
                    //    }
                    //}
                } else {
                    var tempIndex = 0;
                    //if (currentService.playback && eventDateList.getIndex() < 6) {
                    if (eventDateList.getIndex() > 0) {
                        for (var i = 0; i < eventItems.length; i++) {
                            var tempBeginTime = eventItems[i].startDateTime.split(" ")[1];
                            tempBeginTime = tempBeginTime.substr(0, 2);
                            if (parseInt(tempBeginTime, 10) >= 19) {
                                tempIndex = i;
                                break;
                            }
                        }
                    }
                    //alert(eventItems.length)

                    //Todo 暂时注释掉tempindex
                    eventsContentList.resetData({index: tempIndex, items: eventItems});
                    //var eventcontent = SumaJS.getDom("play_tv_info_event_item_content");
                    //eventcontent.style.position = "absolute";
                    //
                    //    if (eventItems.length == 1 || eventItems.length == 2) {
                    //    testTop = "235px"
                    //    } else if (eventItems.length == 3 || eventItems.length == 4) {
                    //    testTop = "188px"
                    //    } else if (eventItems.length == 5 || eventItems.length == 6) {
                    //    testTop = "141px"
                    //    } else if (eventItems.length == 7 || eventItems.length == 8) {
                    //    testTop = "94px"
                    //    } else if (eventItems.length == 9 || eventItems.length == 10) {
                    //    testTop = "47px"
                    //} else {
                    //    testTop = "0px";
                    //}
                    //eventcontent.style.top = testTop;
                    //
                    //eventsContentList.pageSize = Math.min(eventItems.length, 11);
                    //
                    //eventsContentList.resetData({index: 0, items: eventItems});
                }
            }

            function toTimeShift(service) {
                
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
                    var url = PORTAL_ADDR + "/NewFrameWork/UE/html/timeplayer.html?channelId=" + service.channelId+"&backUrl=main://index.html?page=play_tv";
                    enterTimeShift = true;
                    window.location.href = url;
                } else {
                    showPlayTipMsgBox("非时移频道", "play_tip_box2");
                    setTimeout(function () {
                        SumaJS.msgBox.removeMsg("play_tip_box2");
                    }, 2000);
                }        
		    }

            /***************************************** 回看节目控制 END****************************************/
           /***************************************** 连看节目控制 START ****************************************/
          	var relateOrder,relatePlaySource,relatelType,relatesContentListCfg,relatesContentList,relateInfoBox;
        function relateInfos(){
            relateOrder = [];
            relatePlaySource = [];
            relatelType = [];
            for (var i = 0; i < 10; i++) {
                relateOrder.push(SumaJS.getDom("play_tv_info_relate_order" + i));
                relatePlaySource.push(SumaJS.getDom("play_tv_info_relate_playsource" + i));
                relatelType.push(SumaJS.getDom("play_tv_info_relate_type" + i));
            }
            relatesContentListCfg = {
                index: 0,
                items: [],
                pageSize: 10,
                uiObj: {
                    relateOrder: relateOrder,
                    relatePlaySource: relatePlaySource,
                    relateType: relatelType,
                    focusBg: SumaJS.getDom("play_tv_info_relate_focus"),
                    scrollBg: SumaJS.getDom("play_tv_info_relate_scroll")
                },
                showData: function (dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                    if (isUpdate) {
                        if (!dataObj) {
                            for (var i = 0; i < uiObj.relateOrder.length; ++i) {
                                uiObj.relateOrder[i].innerHTML = "";
                                uiObj.relatePlaySource[i].innerHTML = "";
                                uiObj.relateType[i].innerHTML = "";
                            }
                            uiObj.scrollBg.style.top = "43px";
                            uiObj.focusBg.style.top = 32 + "px";
                            uiObj.focusBg.style.display = "none";
                        } else {
                            uiObj.focusBg.style.display = "block";
                            for (var i = 0; i < uiObj.relateOrder.length; ++i) {
                                thirdListStyleControl.setStyleLoseFocus(uiObj.relateOrder[i]);
                                thirdListStyleControl.setStyleLoseFocus(uiObj.relatePlaySource[i],1);
                                thirdListStyleControl.setStyleLoseFocus(uiObj.relateType[i],1);
                                if (dataObj[i]) {
                                    uiObj.relateOrder[i].innerHTML = dataObj[i].Order.length > 3 ? dataObj[i].Order : (" 第" + dataObj[i].Order + "集");
                                    if (dataObj[i].serviceType == "1") {
                                        uiObj.relatePlaySource[i].innerHTML = dataObj[i].PlaySource.TVSource.ChannelName;
                                        uiObj.relateType[i].innerHTML = "直播";
                                        //uiObj.relateType[i].innerHTML = "<img src="+dataObj[i].PlaySource.TVSource.ChannelLogo+">";
                                    } else if (dataObj[i].serviceType == "2") {
                                        uiObj.relatePlaySource[i].innerHTML = dataObj[i].PlaySource.VODSource.TopFolderName;
                                        if (dataObj[i].PlaySource.VODSource.Type == "1") {
                                            uiObj.relateType[i].innerHTML = "电影";
                                        } else if (dataObj[i].PlaySource.VODSource.Type == "2") {
                                            uiObj.relateType[i].innerHTML = "电视剧";
                                        } else {
                                            uiObj.relateType[i].innerHTML = "其它";
                                        }
                                    } else if (dataObj[i].serviceType == "3") {
                                        uiObj.relatePlaySource[i].innerHTML = dataObj[i].PlaySource.ReseedSource.ChannelName;
                                        uiObj.relateType[i].innerHTML = dataObj[i].PlaySource.ReseedSource.Type + "D";
                                    }
                                } else {
                                    uiObj.relateOrder[i].innerHTML = "";
                                    uiObj.relatePlaySource[i].innerHTML = "";
                                    uiObj.relateType[i].innerHTML = "";
                                }
                            }
                        }
                    } else if (lastFocusPos > -1) {
                        thirdListStyleControl.setStyleLoseFocus(uiObj.relateOrder[lastFocusPos]);
                        thirdListStyleControl.setStyleLoseFocus(uiObj.relatePlaySource[lastFocusPos],1);
                        thirdListStyleControl.setStyleLoseFocus(uiObj.relateType[lastFocusPos],1);
                    }
                    if (focusPos > -1) {
                        uiObj.focusBg.style.top = 32 + 47 * focusPos + "px";
                        if (this.getItems().length <= 1) {
                            uiObj.scrollBg.style.top = "43px";
                        } else {
                            uiObj.scrollBg.style.top = (this.getIndex() / (this.getItems().length - 1)) * 466 + 43 + "px";
                        }
                        thirdListStyleControl.setStyleOnFocus(uiObj.relateOrder[focusPos]);
                        thirdListStyleControl.setStyleOnFocus(uiObj.relatePlaySource[focusPos],1);
                        thirdListStyleControl.setStyleOnFocus(uiObj.relateType[focusPos],1);
                    }
                }
            };
            relatesContentList = new SubList(relatesContentListCfg);
            relateInfoBox = {
                focus: 0,
                nameDom: SumaJS.getDom("play_tv_info_relate_program_name"),
                boxContainer: SumaJS.getDom("play_tv_info_relate_list"),
                RelateContent: [],
                getLiveRelateContent: function () {
                    var currTime = new Date();
                    //var netid = DVB.currentDVBNetwork ? DVB.currentDVBNetwork.networkID : -1;
                    var netid =  getMainFreNetworkIDFromJson();
                    // var url1 = UBAServerAdd + "/uba-searchReseed/1.0/json/GetLiveRelateContent?client=" + CA.regionCode + "&NetworkId=" + netid + "&ChannelId=" + currentService.channelId + "&DateTime=" + SumaJS.dateFormat(currTime, "yyyyMMddhhmmss");
                    var url1 = UBAServerAdd + "/uba-searchReseed/1.0/json/GetLiveRelateContent?client=" + CA.regionCode + "&NetworkId=" + netid + "&ChannelId=" + playTvChannelListObj.listObj.getItem().channelId + "&DateTime=" + SumaJS.dateFormat(currTime, "yyyyMMddhhmmss");
                    var ajaxParam = {
                        url: url1,
                        method: "GET",
                        data: "",
                        success: function (data) {
                            var filestr = data.responseText;
                            //alert(1+filestr)
                            var jsonObj = null;
                            try {
                                jsonObj = eval("(" + filestr + ")");
                            } catch (e) {
                                SumaJS.debug("get relateData error");
                                relateInfoBox.dealNodata();
                                return;
                            }
                            if (typeof jsonObj.code != "undefined") {
                                relateInfoBox.dealNodata();
                            } else {
                                //数据采集
                                // if (currentService) {
                                if (playTvChannelListObj.listObj.getItem()) {
                                    // DataCollection.collectData(["13", currentService.channelId, "03", jsonObj.Name, "03", currentService.channelId, currentService.channelId]);
                                    DataCollection.collectData(["13", playTvChannelListObj.listObj.getItem().channelId, "03", jsonObj.Name, "03", playTvChannelListObj.listObj.getItem().channelId, playTvChannelListObj.listObj.getItem().channelId]);
                                }
                                SumaJS.getDom("play_tv_info_relate_tip").innerHTML = "";
                                relateInfoBox.RelateContent = jsonObj.RelateContent;
                                relateInfoBox.nameDom.innerHTML = jsonObj.Name;

                                //add by liwenlei ;
                                SumaJS.debug("lileiTest relateInfoBox.RelateContent = "+JSON.stringify( relateInfoBox.RelateContent));
                                relatesContentList.resetData({index: 0, items: relateInfoBox.RelateContent});
                                if (relateInfoBox.RelateContent.length <= 0) {
                                    relateInfoBox.dealNodata();
                                }
                            }
                        },
                        failed: function (data) {
                            //alert(2+data)
                            relateInfoBox.dealNodata();
                        }
                    }
                    SumaJS.ajax(ajaxParam);
                },
                dealNodata: function () {
                    SumaJS.getDom("play_tv_info_relate_tip").innerHTML = "暂无连看内容";
                    SumaJS.getDom("play_tv_info_relate_focus").style.top = "32px";
                    SumaJS.getDom("play_tv_info_relate_focus").style.display = "block";
                },
                right: function () {
                },
                left: function () {
                    this.hide();
                    playTvSecondMenuListHandler.setFocusState(1);
                },
                up: function () {
                    relatesContentList.up();
                },
                down: function () {
                    relatesContentList.down();
                },
                selected: function () {
                    var dcinfo = {dctype: 3, assetid: -1, pid: -1}; //数据采集使用的类型，其中dctype 1-点播 2-回看 3-直播
                    if (relatesContentList.getItem().serviceType == "1") {
                        dcinfo.dctype = "03";
                        var flag = false;
                        var tempChannel = relatesContentList.getItem();
                        var service = SumaJS.getServiceByChannelId(tempChannel.PlaySource.TVSource.ChannelId);
                        SumaJS.debug("playtv relate select service = " + JSON.stringify(service))
                        if (service) {
                            flag = true;
                            //var index = relatesContentList.getIndex();
                            //DataCollection.collectData(["0a", "MR012", "全屏直播连看", service.serviceName, tempChannel.channelId]);
                            //changeTvMode = "10";
                            dcinfo.assetid = service.channelId;
                            dcinfo.pid = service.channelId;
                            playServiceById(service.logicalChannelId);
                        }
                        if (!flag) {
                            showPlayTipMsgBox("对应频道不存在", "play_tip_box2");
                            setTimeout(function () {
                                SumaJS.msgBox.removeMsg("play_tip_box2");
                            }, 2000);
                        }
                    } else if (relatesContentList.getItem().serviceType == "2") {
                        dcinfo.dctype = "01";
                        dcinfo.assetid = relatesContentList.getItem().PlaySource.VODSource.ItemId;
                        dcinfo.pid = relatesContentList.getItem().PlaySource.VODSource.FolderAssetId;
                        var url = "http://" + portalAddr + "/NewFrameWork/UE/html/vodplayer.html?&assetId=" + relatesContentList.getItem().PlaySource.VODSource.ItemId+"&backUrl=main://index.html?page=play_tv";
                        SumaJS.debug("playtv relate select url= " + url);
                        window.location.href = url;
                    } else if (relatesContentList.getItem().serviceType == "3") {
                        dcinfo.dctype = "02";
                        dcinfo.assetid = relatesContentList.getItem().PlaySource.ReseedSource.AssetId;
                        dcinfo.pid = relatesContentList.getItem().PlaySource.ReseedSource.ChannelId;
                        //var url = "http://" + portalAddr + "/NewFrameWork/UE/html/timeplayer.html?channelId=" + currentService.channelId + "&assetId=" + relatesContentList.getItem().PlaySource.ReseedSource.AssetId+"&backUrl=main://index.html?page=play_tv";
                        //modified by liwenlei ,此处channelId应该修改为该高清节目对应的ChannelId
                        var thisChannelId = relatesContentList.getItem().PlaySource.ReseedSource.ChannelId;
                        var url = "http://" + portalAddr + "/NewFrameWork/UE/html/timeplayer.html?channelId=" + thisChannelId + "&assetId=" + relatesContentList.getItem().PlaySource.ReseedSource.AssetId+"&backUrl=main://index.html?page=play_tv";
                        SumaJS.debug("playtv relate select url= " + url);
                        window.location.href = url;
                    }

                    //数据采集
                    if (currentService) {
                        var item = relatesContentList.getItem();
                        var PROGRAM_NAME = relateInfoBox.nameDom.innerHTML + "_" + item.Order;
                        DataCollection.collectData(["13", currentService.channelId, "02", PROGRAM_NAME, dcinfo.dctype, dcinfo.assetid, dcinfo.pid])
                    }
                },
                show: function () {
                    this.focus = 1;
                    this.boxContainer.style.display = "block";
                    this.nameDom.innerHTML = "";
                    relatesContentList.uiObj.focusBg.style.display = "none";
                    SumaJS.getDom("play_tv_info_relate_tip").innerHTML = "正在加载内容...";
                    relatesContentList.resetData({index: 0, items: []});
                    this.getLiveRelateContent();
                },
                hide: function () {
                    this.focus = 0;
                    this.boxContainer.style.display = "none";
                    //恢复订购
                    if (channelOrderFlag) {
                        var temp_status1 = channelOrder.alertDom ? channelOrder.alertDom.style.display : "none";
                        var temp_status2 = channelOrder.orderSelectDom ? channelOrder.orderSelectDom.style.display : "none";
                        if (temp_status1 == "block" || temp_status2 == "block") {
                            channelOrder.getFocus();
                        }
                    }
                },
                eventHandler: function (event) {
                    var val = event.keyCode || event.which;
                    SumaJS.debug("====playtv relateInfoBox get msg=== which[" + val + "]");
                    if (!this.focus) {
                        return true;
                    }
                    switch (val) {
                        case KEY_LEFT:
                        case KEY_BACK:
                            this.left();
                            break;
                        case KEY_RIGHT:
                            this.right();
                            break;
                        case KEY_UP:
                            this.up();
                            break;
                        case KEY_DOWN:
                            this.down();
                            break;
                        case KEY_PAGE_UP:
                            relatesContentList.pageUp();
                            break;
                        case KEY_PAGE_DOWN:
                            relatesContentList.pageDown();
                            break;
                        case KEY_ENTER:
                            this.selected();
                            this.hide();
                            playTvSecondMenuListHandler.hide();
                            playTvListHandler.hide();
                            break;
                        case KEY_EXIT:
                            playTvHandler.focus = 1;
                            this.hide();
                            playTvSecondMenuListHandler.hide();
                            playTvListHandler.hide();
                            break;
                        case KEY_VOLUME_DOWN:
                        case KEY_VOLUME_UP:
                            playTvHandler.focus = 1;
                            this.hide();
                            playTvSecondMenuListHandler.hide();
                            playTvListHandler.hide();
                            if (volumebar) {
                                if (val == KEY_VOLUME_DOWN) {
                                    volumebar.volumeDown(currentService, {
                                        curService: currentService,
                                        code: "45",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                    ADContrl.switchVolumebarImg();
                                } else {
                                    volumebar.volumeUp(currentService, {
                                        curService: currentService,
                                        code: "61",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                    ADContrl.switchVolumebarImg();
                                }
                            }
                            break;
                        case KEY_MUTE:
                            if (volumebar) {
                                volumebar.muteFunc();
                            }
                            break;
                        case KEY_GREEN:
                            return false;
                            break;
                        default:
                            return true;
                            break;
                    }
                }
            };
            relateInfoBox.hide();
            SumaJS.eventManager.addEventListener("relateInfoBox", relateInfoBox, 91);
        }    
            /***************************************** 连看节目控制 END****************************************/
            /***************************************** 常看节目控制 START ****************************************/
           var favChannelName,favSettingFocus,favsContentListCfg,favsContentList,favInfoBox;
        function  favChannels(){
            favChannelName = [];
            for (var i = 0; i < 10; i++) {
                favChannelName.push(SumaJS.getDom("play_tv_info_fav_name" + i));
            }
            favSettingFocus = false;
            favsContentListCfg = {
                index: 0,
                items: [],
                pageSize: 10,
                uiObj: {
                    favChannelName: favChannelName,
                    focusBg: SumaJS.getDom("play_tv_info_fav_focus"),
                    scrollBg: SumaJS.getDom("play_tv_info_fav_scroll")
                },
                showData: function (dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                    if (isUpdate) {
                        if (!dataObj) {
                            for (var i = 0; i < uiObj.favChannelName.length; ++i) {
                                uiObj.favChannelName[i].innerHTML = "";
                            }
                            uiObj.scrollBg.style.top = 43 + "px";
                            uiObj.focusBg.style.top = -15 + "px";
                            //uiObj.focusBg.style.display = "none";
							favInfoBox.nameDom.innerHTML = "设本频道为 常看频道";  //add by liwenlei 
                        } else {
                            uiObj.focusBg.style.display = "block";
                            for (var i = 0; i < uiObj.favChannelName.length; ++i) {
                                thirdListStyleControl.setStyleLoseFocus(uiObj.favChannelName[i]);
                                if (dataObj[i]) {
                                    var channel = SumaJS.getServiceByChannelId(dataObj[i].ChannelId)
                                    if (channel) {
                                        uiObj.favChannelName[i].innerHTML = channel.serviceName;
                                    }
                                } else {
                                    uiObj.favChannelName[i].innerHTML = "";
                                }
                            }
                            if (favInfoBox.isFavChannel) {
                                favInfoBox.nameDom.innerHTML = "本频道已为 常看频道";
                            } else {
                                favInfoBox.nameDom.innerHTML = "设本频道为 常看频道";
                            }
                        }
                    } else if (lastFocusPos > -1) {
                        thirdListStyleControl.setStyleLoseFocus( uiObj.favChannelName[lastFocusPos]);
                    }
                    if (focusPos > -1) {
                        uiObj.focusBg.style.top = 32 + 47 * focusPos + "px";
                        if (this.getItems().length <= 1) {
                            uiObj.scrollBg.style.top = "43px";
                        } else {
                            uiObj.scrollBg.style.top = (this.getIndex() / (this.getItems().length - 1)) * 466 + 43 + "px";
                        }
                        thirdListStyleControl.setStyleOnFocus( uiObj.favChannelName[focusPos]);
                    }
                }
            };
            favsContentList = new SubList(favsContentListCfg);
            favInfoBox = {
                focus: 0,
                isFavChannel: false,
                userFavChannelCount: 0,
                userFavChannels: [],
                recFavChannels: [],
                nameDom: SumaJS.getDom("play_tv_info_fav_current_status"),
                boxContainer: SumaJS.getDom("play_tv_info_fav_list"),
                favContent: [],
                getFavChannelsFrmJSON: function () {
                    oftenWatchObj.getUserChannelsByJson();
                    oftenWatchObj.getRecChannels();
                    var userChannels = oftenWatchObj.getUserArray();
                    var recChannels = oftenWatchObj.getRecArray();
                    if (userChannels) {
                        favInfoBox.userFavChannelCount = userChannels.length;
                    }
                    favInfoBox.userFavChannels = userChannels;
                    var temp = oftenWatchObj.concatUserAndRecChannels(userChannels, recChannels);
                    favInfoBox.favContent = favInfoBox.deleteUnlegalChannel(temp);
                    favInfoBox.checkIfFavChannel(favInfoBox.favContent);
                    SumaJS.getDom("play_tv_info_fav_tip").innerHTML = "";
                    favsContentList.resetData({index: 0, items: favInfoBox.favContent});
                },
                checkIfFavChannel: function (dataArr) {
                    if (dataArr.length <= 0) {
                        this.isFavChannel = false;
                        return;
                    }
                    var flag = false;
                    for (var i = 0; i < dataArr.length; i++) {
                        // if (dataArr[i].ChannelId == currentService.channelId) {
                        if (dataArr[i].ChannelId == playTvChannelListObj.listObj.getItem().channelId) {
                            this.isFavChannel = true;
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        this.isFavChannel = false;
                    }
                },
                setFavChannel: function (service) {
                    if (parseInt(service.channelId) <= 0) {
                        showCaTip("抱歉，此频道暂不支持设置为常看频道");
                        setTimeout(function () {
                            SumaJS.msgBox.removeMsg("ca_msg");
                        }, 2000);
                        return;
                    }
                    if (this.userFavChannelCount >= 20) {
                        showCaTip("常看频道已满20个，请前往直播页面清理");
                        setTimeout(function () {
                            SumaJS.msgBox.removeMsg("ca_msg");
                        }, 2000);
                    } else {
                        //alert(JSON.stringify(this.userFavChannels))
                        if (service) {
                            this.userFavChannels.unshift({"ChannelId": service.channelId, Order: ""});
                        }
                        var data = {"clientID": CA.icNo, "Channels": []};
                        for (var i = 0, len = this.userFavChannels.length; i < len; i++) {
                            var tmp = this.userFavChannels[i];
                            data.Channels.push({"ChannelId": tmp.ChannelId, "Order": i + 1});
                        }
                        //alert("modifyToJson data = " + JSON.stringify(data));
                        saveJSONFile(oftenWatchObj.fileUrl, data, 1);
                        favSettingFocus = false;
                        favsContentList.uiObj.focusBg.style.top = "32px";
                        this.getFavChannelsFrmJSON();
                        this.saveFavChannelToUBA(data);
                    }
                },
                saveFavChannelToUBA: function (data) {
                    var jsonStr = JSON.stringify(data);
                    SumaJS.debug("@@@ jsonStr=" + jsonStr);
                    var sendCfg = {
                        url: UBAServerAdd + "/uba-searchReseed/1.0/json/SetFavChannels",
                        method: "POST",
                        async: true,
                        data: jsonStr,
                        success: function (action) {
                            var text = action.responseText;
                            SumaJS.debug("@@@ SetFavChannels to UBA result=" + text);
                        },
                        failed: function (action) {
                            SumaJS.debug("SetFavChannels to UBA failed!!");
                        }
                    };
                    SumaJS.ajax(sendCfg);
                },
                deleteUnlegalChannel: function (dataArr) {
                    var tempArr = [], isRepeated;
                    if (!dataArr) {
                        return tempArr;
                    }
                    //去非法、去重
                    for (var i = 0; i < dataArr.length; i++) {
                        var channel = SumaJS.getServiceByChannelId(dataArr[i].ChannelId);
                        isRepeated = false;
                        if (channel) {
                            for (var j = 0; j < tempArr.length; j++) {
                                if (parseInt(dataArr[i].ChannelId) == parseInt(tempArr[j].ChannelId)) {
                                    isRepeated = true;
                                    break;
                                }
                            }
                            if (!isRepeated) {
                            tempArr.push(dataArr[i]);
                            }
                        }
                    }
                    return tempArr;
                },
                right: function () {
                },
                left: function () {
                    this.hide();
                    playTvSecondMenuListHandler.setFocusState(1);
                },
                up: function () {
                    favsContentList.up();
                },
                down: function () {
                    favsContentList.down();
                },
                selected: function () {
                    this.hide();
                    var flag = false;
                    var tempChannel = favsContentList.getItem();
                    var service = SumaJS.getServiceByChannelId(tempChannel.ChannelId);
                    if (service) {
                        flag = true;
                        var index = favsContentList.getIndex();
                        DataCollection.collectData(["0a", "MR012", "全屏直播常看频道", service.serviceName, tempChannel.ChannelId]);
                        changeTvMode = "47";
                        playServiceById(service.logicalChannelId);
                    }
                    if (!flag) {
                        showPlayTipMsgBox("对应频道不存在", "play_tip_box2");
                        setTimeout(function () {
                            SumaJS.msgBox.removeMsg("play_tip_box2");
                        }, 2000);
                    }
                },
                show: function () {
                    this.focus = 1;
                    this.boxContainer.style.display = "block";
                    this.nameDom.innerHTML = "";
                    favsContentList.uiObj.focusBg.style.display = "none";
                    SumaJS.getDom("play_tv_info_fav_tip").innerHTML = "正在加载内容...";
                    favsContentList.resetData({index: 0, items: []});
                    this.getFavChannelsFrmJSON();
                    //if (favsContentList.getIndex() == 0 && !this.isFavChannel) {
					if (favsContentList.getItems().length ==0 || (favsContentList.getIndex() == 0 && !this.isFavChannel)) {   //modify by liwenlei 没有常看频道时也要显示。
						favsContentList.uiObj.focusBg.style.display = "block";
                        favsContentList.uiObj.focusBg.style.top = "-15px";
                        favSettingFocus = true;
                    }
                },
                hide: function () {
                    this.focus = 0;
                    this.boxContainer.style.display = "none";
                    //恢复订购
                    if (channelOrderFlag) {
                        var temp_status1 = channelOrder.alertDom ? channelOrder.alertDom.style.display : "none";
                        var temp_status2 = channelOrder.orderSelectDom ? channelOrder.orderSelectDom.style.display : "none";
                        if (temp_status1 == "block" || temp_status2 == "block") {
                            channelOrder.getFocus();
                        }
                    }
                },
                eventHandler: function (event) {
                    var val = event.keyCode || event.which;
                    SumaJS.debug("====playtv favInfoBox get msg=== which[" + val + "]");
                    if (!this.focus) {
                        return true;
                    }
                    switch (val) {
                        case KEY_LEFT:
                        case KEY_BACK:
                            this.left();
                            break;
                        case KEY_RIGHT:
                            this.right();
                            break;
                        case KEY_UP:
                            if (favsContentList.getIndex() == 0 && !this.isFavChannel) {
                                favsContentList.uiObj.focusBg.style.top = "-15px";
                                favSettingFocus = true;
                            } else {
                                favsContentList.up();
                            }
                            break;
                        case KEY_DOWN:
                            if (favSettingFocus) {
								if (favsContentList.getItems().length ==0){  //没有时不响应。
									return ;
								}								
                                favSettingFocus = false;
                                favsContentList.uiObj.focusBg.style.top = "32px";
                            } else {
                                favsContentList.down();
                            }
                            break;
                        case KEY_PAGE_UP:
                            favsContentList.pageUp();
                            break;
                        case KEY_PAGE_DOWN:
                            favsContentList.pageDown();
                            break;
                        case KEY_ENTER:
                            if (favSettingFocus) {
                                // this.setFavChannel(currentService);
                                this.setFavChannel(playTvChannelListObj.listObj.getItem());
                            } else {
                                this.selected();
                                playTvSecondMenuListHandler.hide();
                                playTvListHandler.hide();
                            }
                            break;
                        case KEY_EXIT:
                            playTvHandler.focus = 1;
                            this.hide();
                            playTvSecondMenuListHandler.hide();
                            playTvListHandler.hide();
                            break;
                        case KEY_VOLUME_DOWN:
                        case KEY_VOLUME_UP:
                            playTvHandler.focus = 1;
                            this.hide();
                            playTvSecondMenuListHandler.hide();
                            playTvListHandler.hide();
                            if (volumebar) {
                                if (val == KEY_VOLUME_DOWN) {
                                    volumebar.volumeDown(currentService, {
                                        curService: currentService,
                                        code: "45",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                    ADContrl.switchVolumebarImg();
                                } else {
                                    volumebar.volumeUp(currentService, {
                                        curService: currentService,
                                        code: "61",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                    ADContrl.switchVolumebarImg();
                                }
                            }
                            break;
                        case KEY_MUTE:
                            if (volumebar) {
                                volumebar.muteFunc();
                            }
                            break;
                        case KEY_GREEN:
                            return false;
                            break;
                        default:
                            return true;
                            break;
                    }
                }
            };
            favInfoBox.hide();
            SumaJS.eventManager.addEventListener("favInfoBox", favInfoBox, 92);
        }
            /***************************************** 常看节目控制 END****************************************/
            /**************************************排行控制START*******************************************/
            var temp0 = [], temp1 = [], temp2 = [], temp3 = [], temp4 = [];
            var cfg,liveChannelList,liveChannelTop_count,refreshChannelTopTimer,liveChannelTop;
        function liveChannels(){
            for (var i = 0; i < 4; i++) {
                temp0[i] = SumaJS.getDom("chan_top_cell0_" + i);
                temp1[i] = SumaJS.getDom("chan_top_cell1_" + i);
                temp2[i] = SumaJS.getDom("chan_top_cell2_" + i);
                temp3[i] = SumaJS.getDom("chan_top_cell3_" + i);
                temp4[i] = SumaJS.getDom("chan_top_cell4_" + i);
            }
            cfg = {
                index: 0,
                items: [],
                pageSize: 4,
                type: 1,
                uiObj: {
                    idxArray: temp0,                //排行榜排名
                    channelNameArray: temp1,            //排行榜电视频道名称
                    itemNameArray: temp2,           //节目名称
                    valueArray: temp3,              //排行榜观看人数
                    flagArray: temp4,               //标记
                    focusBg: SumaJS.getDom("channel_top_focus"),
                    scrollBg: SumaJS.getDom("channel_top_scroll")
                },
                showData: function (dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                    if (isUpdate) {
                        if (!dataObj) {
                            for (var i = 0; i < uiObj.idxArray.length; ++i) {
                                uiObj.idxArray[i].innerHTML = "";
                                uiObj.idxArray[i].style.background = "";
                                uiObj.idxArray[i].style.border = "";
                                uiObj.channelNameArray[i].innerHTML = "";
                                uiObj.itemNameArray[i].innerHTML = "";
                                uiObj.valueArray[i].innerHTML = "";
                                uiObj.flagArray[i].style.background = "";
                                uiObj.flagArray[i].innerHTML = "";
                                SumaJS.getDom("chan_top_cell2_1").innerHTML = "";
                            }
                            uiObj.focusBg.style.display = "none";
                            uiObj.focusBg.style.top = "128px";
                            uiObj.scrollBg.style.top = "-9px";
                        } else {
                            var i = 0;
							var arr0 = this.getItems()[0]; 
                            for (; i < uiObj.idxArray.length; ++i) {
                                if (dataObj[i]) {
                                    //uiObj.idxArray[i].innerHTML = this.getStartIndex()+i+1;
                                    //uiObj.idxArray[i].innerHTML = (dataObj[0].RecType != 0) ? (this.getStartIndex() + i) : (this.getStartIndex() + i + 1);                                    
									 //modify by liwenlei 只判断整个数据中的首项,而不是判断每个列表中的首项
									uiObj.idxArray[i].innerHTML = (arr0.RecType != 0) ? (this.getStartIndex() + i) : (this.getStartIndex() + i + 1);
                                    
									//uiObj.idxArray[i].style.border = "#fff799 1px solid";									
									//modified by liwenlei 只有前三个有border
                                    if(this.getIndex() < 4){
                                        if(arr0.RecType != 0){   //有推荐
                                            uiObj.idxArray[i].style.border = "#fff799 1px solid";
                                        }else{   //无推荐
                                            if(i<3){
                                                uiObj.idxArray[i].style.border = "#fff799 1px solid";
                                            }else{
                                                uiObj.idxArray[i].style.border = "";
                                            }
                                        }
                                    }else{
                                        uiObj.idxArray[i].style.border = "";
                                    }

									
                                    uiObj.channelNameArray[i].innerHTML = dataObj[i].ChannelName;
                                    uiObj.itemNameArray[i].innerHTML = dataObj[i].ItemName;
                                    uiObj.valueArray[i].innerHTML = "人气: " + dataObj[i].Value;
                                    uiObj.flagArray[i].innerHTML = "趋势: ";
                                    uiObj.flagArray[i].style.background = "url(images/play/" + dataObj[i].Trend + ".png) 95% 50% no-repeat";
                                    uiObj.channelNameArray[i].style.color = "#8b9299";
                                    uiObj.itemNameArray[i].style.color = "#8b9299";
                                    uiObj.valueArray[i].style.color = "#8b9299";
                                    uiObj.flagArray[i].style.color = "#8b9299";
                                    uiObj.channelNameArray[i].style.fontSize = "20px";
                                    uiObj.itemNameArray[i].style.fontSize = "20px";
                                } else {
                                    uiObj.idxArray[i].innerHTML = "";
                                    uiObj.channelNameArray[i].innerHTML = "";
                                    uiObj.itemNameArray[i].innerHTML = "";
                                    uiObj.valueArray[i].innerHTML = "";
                                    uiObj.flagArray[i].style.background = "";
                                    uiObj.flagArray[i].innerHTML = "";
                                    uiObj.idxArray[i].style.border = "";
                                }
                            }


                        }
                    } else if (lastFocusPos > -1) {
                        uiObj.channelNameArray[lastFocusPos].innerHTML = dataObj[lastFocusPos].ChannelName;
                        uiObj.itemNameArray[lastFocusPos].innerHTML = dataObj[lastFocusPos].ItemName;
                        //uiObj.channelNameArray[lastFocusPos].className = "chan_top_cell1";
                        uiObj.channelNameArray[lastFocusPos].style.color = "#8b9299";
                        uiObj.itemNameArray[lastFocusPos].style.color = "#8b9299";
                        uiObj.valueArray[lastFocusPos].style.color = "#8b9299";
                        uiObj.flagArray[lastFocusPos].style.color = "#8b9299";
                        uiObj.channelNameArray[lastFocusPos].style.fontSize = "20px";
                        uiObj.itemNameArray[lastFocusPos].style.fontSize = "20px";
                    }
                    if (focusPos > -1) {
                        uiObj.focusBg.style.display = "block";
                        //uiObj.channelNameArray[focusPos].innerHTML = displayText(dataObj[focusPos].ChannelName, 166, 24);
                        //uiObj.itemNameArray[focusPos].innerHTML = displayText(dataObj[focusPos].ItemName, 310, 24);
                        uiObj.channelNameArray[focusPos].innerHTML = dataObj[focusPos].ChannelName;
                        //uiObj.itemNameArray[focusPos].innerHTML = dataObj[focusPos].ItemName;
						uiObj.itemNameArray[focusPos].innerHTML = displayText(dataObj[focusPos].ItemName, 185, 24);
                        //uiObj.focusBg.style.top = 81 + 101 * focusPos + "px";
                        uiObj.focusBg.style.top = 107 + 95 * focusPos + "px";
                        if (this.getItems().length <= 1) {
                            uiObj.scrollBg.style.top = "-9px";
                        } else {
                            uiObj.scrollBg.style.top = (this.getIndex() / (this.getItems().length - 1)) * 518 + (-9) + "px";
                        }
                        //uiObj.channelNameArray[focusPos].className = "chan_top_cell1_onfocus";
                        uiObj.channelNameArray[focusPos].style.color = "#FFFFFF";
                        uiObj.itemNameArray[focusPos].style.color = "#FFFFFF";
                        uiObj.valueArray[focusPos].style.color = "#FFFFFF";
                        uiObj.flagArray[focusPos].style.color = "#FFFFFF";
                        uiObj.itemNameArray[focusPos].style.fontSize = "22px";
                        uiObj.channelNameArray[focusPos].style.fontSize = "22px";
                    }
                    if (dataObj && dataObj[0].RecType != 0) {//有推荐
                        uiObj.idxArray[0].innerHTML = "荐";
                        uiObj.idxArray[0].style.color = "#fff799";
                        uiObj.idxArray[0].style.border = "";
                    }
                }
            };
            liveChannelList = new SubList(cfg);

            liveChannelTop_count = 16;
            if (originalArray && originalArray.UBAServer && originalArray.UBAServer.Count) {
                liveChannelTop_count = originalArray.UBAServer.Count * 1;
            }
            refreshChannelTopTimer = -1;
            liveChannelTop = {
                focus: 0,
                REC_URL1: UBAServerAdd + "/uba-online-mongodb/1.0/json/GetLiveChannelTop",//请求服务器地址
                REC_URL2: UBAServerAdd + "/uba-online-mongodb/1.0/json/GetLiveChannelInfo",
                ClientId: CA.icNo,              //用户卡号(String),必选
                RegionCode: CA.regionCode,              //区域代码(String),可选
               // NetworkId: DVB.currentDVBNetwork ? DVB.currentDVBNetwork.networkID : -1,
                NetworkId: getMainFreNetworkIDFromJson(),
                NumberOfResults: liveChannelTop_count,          //结果个数(Number),可选,默认为16
                TopType: "Current",         //(String),必选,"Current":当前排行,"Day":日排行,"Week":周排行"Month":月排行
                RegionType: 1,              //排名的地域范围 0–全省数据排行, 1–本地数据排行
                RequestType: 0,             //(Number),必选,0-全部,1-央视排行,2-卫视排行,3-境外排行
                Target: 2,                  //(Number),必选,0-点击量,1-观看时长比例,2-观看人数

                Info: {},               //获得的排行榜信息

                get: function (func) {
                    var url1 = this.REC_URL1 + "?ClientId=" + this.ClientId + "&RegionCode=" + this.RegionCode + "&NetworkId=" + this.NetworkId + "&NumberOfResults=" + this.NumberOfResults + "&TopType=" + this.TopType + "&RegionType=" + this.RegionType + "&RequestType=" + this.RequestType + "&Target=" + this.Target + "&NeedChannelRec=1";
                    var ajaxParam = {
                        url: url1,
                        method: "GET",
                        data: "",
                        success: function (data) {
                            SumaJS.getDom("chan_top_cell2_1").innerHTML = "";
                            SumaJS.getDom("play_tv_channel_top_tip").innerHTML = "";
                            var filestr = data.responseText;
                            //alert(1+filestr)
                            try {
                                liveChannelTop.Info = eval("(" + filestr + ")");
                            } catch (e) {
                                SumaJS.debug("GetLiveChannelTop parse error");
                                liveChannelTop.dealNodata();
                                return;
                            }
                            if (typeof liveChannelTop.Info.code != "undefined") {
                                liveChannelTop.dealNodata();
                            } else {
                                func();
                                if (liveChannelList.getItems().length <= 0) {
                                    liveChannelTop.dealNodata();
                                }
                            }
                        },
                        failed: function (data) {
                            //alert(2+data)
                            liveChannelTop.dealNodata();
                            for (var i = 0; i < 8; ++i) {
                                SumaJS.getDom("chan_top_cell0_" + i).innerHTML = "";
                                SumaJS.getDom("chan_top_cell1_" + i).innerHTML = "";
                                SumaJS.getDom("chan_top_cell2_" + i).innerHTML = "";
                                SumaJS.getDom("chan_top_cell3_" + i).innerHTML = "";
                                SumaJS.getDom("chan_top_cell4_" + i).style.background = "";
                            }
                            if (liveChannelList.getItems().length <= 0) {
                            }
                        }
                    }
                    SumaJS.ajax(ajaxParam);

                    //当前频道收视
                    SumaJS.getDom("currentchannel_top_cell1").innerHTML = currentService.serviceName;
                    SumaJS.getDom("currentchannel_top_cell0").innerHTML = "当前";
                    var url2 = this.REC_URL2 + "?ClientId=" + this.ClientId + "&RegionCode=" + this.RegionCode + "&TopType=" + this.TopType + "&RegionType=" + this.RegionType + "&Target=" + this.Target + "&ChannelId=" + currentService.channelId;
                    var ajaxParam = {
                        url: url2,
                        method: "GET",
                        data: "",
                        success: function (data) {
                            var filestr = data.responseText;
                            //alert(1+filestr);
                            try {
                                var currentInfo = eval("(" + filestr + ")");
                            } catch (e) {
                                SumaJS.debug("GetLiveChannelInfo parse error")
                            }
                            if (typeof currentInfo.code != "undefined") {
                                SumaJS.getDom("currentchannel_top_cell2").innerHTML = "";
                            } else {
                                if (typeof currentInfo.LiveChannelInfo != "undefined") {
                                    //SumaJS.getDom("currentchannel_top_cell0").innerHTML = liveChannelTop.Info.CurrentChannel.Order;
                                    //SumaJS.getDom("currentchannel_top_cell0").innerHTML = "当前";
                                    SumaJS.getDom("currentchannel_top_cell2").innerHTML = currentInfo.LiveChannelInfo.ItemName;
                                    SumaJS.getDom("currentchannel_top_cell3").innerHTML = "人气: " + currentInfo.LiveChannelInfo.Value;
                                    SumaJS.getDom("currentchannel_top_cell4").innerHTML = "趋势: ";
                                    //SumaJS.getDom("currentchannel_top_cell4").style.background = "url(images/play/" + currentInfo.LiveChannelInfo.Trend + ".png) 95% 50% no-repeat";
                                    SumaJS.getDom("currentchannel_top_cell4").style.background = "url(images/play/0.png) 95% 50% no-repeat";
                                }
                            }
                        },
                        failed: function (data) {
                            //alert(2+data);
                            SumaJS.getDom("currentchannel_top_cell2").innerHTML = "";
                            SumaJS.getDom("currentchannel_top_cell3").innerHTML = "";
                            SumaJS.getDom("currentchannel_top_cell4").style.background = "";
                        }
                    }
                    SumaJS.ajax(ajaxParam);
                },
                dealNodata: function () {
                    liveChannelList.resetData({
                        index: liveChannelList.getIndex() >= 0 ? liveChannelList.getIndex() : 0,
                        items: []
                    });
                    SumaJS.getDom("play_tv_channel_top_tip").innerHTML = "暂无排行内容";
                    SumaJS.getDom("channel_top_focus").style.top = "107px";
                    SumaJS.getDom("channel_top_focus").style.display = "block";
                },
                selected: function () {
                    this.hide();
                    var flag = false;
                    var tempChannel = liveChannelList.getItem();
                    var service = SumaJS.getServiceByChannelId(tempChannel.channelId);
                    if (service) {
                        flag = true;
                        var index = liveChannelList.getIndex();
                        DataCollection.collectData(["0a", "MR012", "全屏直播频道排行", service.serviceName, tempChannel.channelId, this.Info.LiveChannelTop.TopItem[index].RecType]);
                        changeTvMode = "10";
                        playServiceById(service.logicalChannelId);
                    }
                    if (!flag) {
                        showPlayTipMsgBox("对应频道不存在", "play_tip_box2");
                        setTimeout(function () {
                            SumaJS.msgBox.removeMsg("play_tip_box2");
                        }, 2000);
                    }
                },
                show: function () {
                    SumaJS.getDom("play_tv_channel_top_tip").innerHTML = "";
                    for (var i = 0; i < this.Info.LiveChannelTop.TopItem.length; i++) {
                        if (this.Info.LiveChannelTop.TopItem[i].RecType != 0) {
                            var recommendItem = this.Info.LiveChannelTop.TopItem.splice(i, 1);
                            this.Info.LiveChannelTop.TopItem.unshift(recommendItem[0]);
                            break;
                        }
                    }
					//添加打印，用于抓取排行数据
					SumaJS.debug("lileiTest1 this.Info.LiveChannelTop.TopItem= "+ JSON.stringify(this.Info.LiveChannelTop.TopItem));
                    liveChannelList.resetData({
                        index: liveChannelList.getIndex() >= 0 ? liveChannelList.getIndex() : 0,
                        items: this.Info.LiveChannelTop.TopItem
                    });
                },

                hide: function () {
                    this.focus = 0;
                    //playTvHandler.focus = 1;
                    //playTvSecondMenuListHandler.setFocusState(1);
                    clearInterval(refreshChannelTopTimer);
                    SumaJS.getDom("channel_top").style.display = "none";

                    //恢复订购
                    if (channelOrderFlag) {
                        var temp_status1 = channelOrder.alertDom ? channelOrder.alertDom.style.display : "none";
                        var temp_status2 = channelOrder.orderSelectDom ? channelOrder.orderSelectDom.style.display : "none";
                        if (temp_status1 == "block" || temp_status2 == "block") {
                            channelOrder.getFocus();
                        }
                    }
                },
                eventHandler: function (event) {
                    var val = event.keyCode || event.which;
                    SumaJS.debug("====liveChannelTop get msg=== which[" + val + "]");
                    if (!this.focus) {
                        return true;
                    }
                    switch (val) {
                        case KEY_UP:
                            if (liveChannelList.getItems().length > 0) {
                                liveChannelList.up();
                            }
                            break;
                        case KEY_DOWN:
                            if (liveChannelList.getItems().length > 0) {
                                liveChannelList.down();
                            }
                            break;
                        case KEY_PAGE_UP:
                            if (liveChannelList.getItems().length > 0) {
                                liveChannelList.pageUp();
                            }
                            break;
                        case KEY_PAGE_DOWN:
                            if (liveChannelList.getItems().length > 0) {
                                liveChannelList.pageDown();
                            }
                            break;
                        case KEY_ENTER:
                            if (liveChannelList.getItems().length > 0) {
                                this.selected();
                                playTvSecondMenuListHandler.hide();
                                playTvListHandler.hide();
                            }
                            break;
                        case KEY_EXIT:
                        case KEY_GREEN:
                            this.hide();
                            playTvSecondMenuListHandler.hide();
                            playTvListHandler.hide();
                            break;
                        case KEY_BACK:
                        case KEY_LEFT:
                            this.hide();
                            playTvSecondMenuListHandler.setFocusState(1);
                            break;
                        case KEY_VOLUME_DOWN:
                        case KEY_VOLUME_UP:
                            this.hide();
                            playTvSecondMenuListHandler.hide();
                            playTvListHandler.hide();
                            if (volumebar) {
                                if (val == KEY_VOLUME_DOWN) {
                                    volumebar.volumeDown(currentService, {
                                        curService: currentService,
                                        code: "45",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                    ADContrl.switchVolumebarImg();
                                } else {
                                    volumebar.volumeUp(currentService, {
                                        curService: currentService,
                                        code: "61",
                                        mode: changeTvMode,
                                        status: playTvStatus
                                    });
                                    ADContrl.switchVolumebarImg();
                                }
                            }
                            break;
                        case KEY_MUTE:
                            if (volumebar) {
                                volumebar.muteFunc();
                            }
                            break;
                        default:
                            break;
                    }
                    return false;
                }
            };
            SumaJS.eventManager.addEventListener("liveChannelTop", liveChannelTop, 100);
        }
            /**************************************排行控制END***************************************/
            /***************************************** password box ****************************************/
            passwordBox = null;
            function showPasswordBox() {
                if (passwordBox) {
                    passwordBox.setFocusState(1);
                } else {
                    var successFun = function () {
                        setTempUnLock(currentService);
                        playCurrentService(currentService);
                    };
                    var failedFun = function () {
                    };
                    var cancelFun = function () {
                    };
                    createPasswordBox(successFun, failedFun, cancelFun);
                }
            }

            /***************************************** password box end ****************************************/

            /***************************************** CA message ****************************************/
            var caMsg = {
                eventHandler: function (event) {
                    var val = event.keyCode || event.which;
                    var event_modifer = parseInt(event.modifiers);
                    SumaJS.debug("====playtv CA message === which[" + val + "]");
                    switch (val) {
                        case SYSEVT_DVB_EIT_EVENT_DESCRIPTOR_READY: //用户调查
                            //zengQiang.show();
                            return false;
                        case MSG_DVB_TUNE_SUCCESS:
                            if (SumaJS.msgBox) {
                                SumaJS.msgBox.removeMsg("play_tip_box1");
                            }
                            if (currentService) {
                                SumaJS.globalPlayer.playService(currentService);
                            }
                            playTvStatus = "01";
                            document.body.style.background = "transparent";
                            playSuccess = true;
                            return false;
                        case MSG_DVB_TUNE_FAILED:
                            if (!playSuccess) {
                                document.body.style.background = "#000";
                            }
                            playTvStatus = "04";
                            //showPlayTipMsgBox("信号中断，请检查网络信号，如需<br />帮助，请拨打客服热线96956", "play_tip_box1");
                            return false;
                        case 11701:
                            playTvStatus = "02";
                            showCaTip("没有购买此节目");
                            return false;
                        case 11702:
                            document.body.style.background = "transparent";
                            if (channelOrderFlag) {
                                if (channelOrder.type == 6) {
                                    channelOrder.show(3);
                                } else {
                                    channelOrder.exit();
                                }
                            }
                            if (SumaJS.msgBox) {
                                SumaJS.msgBox.removeMsg("ca_msg");
                            }
                            playCAMsg = "";
                            return false;
                        case 11705:
                            var evtObj = eval("(" + SysSetting.getEventInfo(event_modifer) + ")");
                            //var evtObj = {"content":"OSD 显示测试","count":2,"type":1};
                            showOSD(evtObj.content, evtObj.count, evtObj.type);
                            return false;
                        case 11536: //新邮件事件
                            SumaJS.getDom("mail_icon").style.display = "block";
                            return false;
					case 13001://三屏互动
                            var stbType = SysInfo.STBType;
                            SumaJS.debug("Wifi get message ROC_SYSEVENT_SWITCH_SCREEN(13001) stbType is" + stbType);
                            if (68 != stbType && 71 != stbType && 72 != stbType && 73 != stbType && 74 != stbType && 75 != stbType && 76 != stbType)
                                return;
                            SumaJS.debug("playTv SWITCH_SCREEN: Get switch msg");
                            var params;
                            var event_13001_modifiers = SysSetting.getEventInfo(event.modifiers);
                            SumaJS.debug("playTv SWITCH_SCREEN: event_13001_modifiers = " + event_13001_modifiers);
                            var event_13001 = eval('(' + event_13001_modifiers + ')');
                            SumaJS.debug("playTv SWITCH_SCREEN: event_13001_modifiers change to object = " + event_13001);
                            if (currentService) {
                                SumaJS.debug("playTv SWITCH_SCREEN: playTvObj.playService exist");
                                var currentAudioPid = 0;
                                currentAudioPid = currentService.audioArray[0].AudioPid;
                                SumaJS.debug("playTv SWITCH_SCREEN: audioPid = " + currentAudioPid);
                                var videoPid = 0;
                                var fre = currentService.tsInfo.Frequency;
                                var sym = currentService.tsInfo.SymbolRate;
                                var mod = currentService.tsInfo.Modulation;
                                if (currentService.serviceType == 1 || currentService.serviceType == 17) {
                                    videoPid = currentService.videoPid;
                                }
                                SumaJS.debug("playTv SWITCH_SCREEN: videoPid = " + videoPid);
                                var nid = currentService.networkId;
                                var tsid = currentService.tsInfo.TsId;
                                var serviceid = currentService.serviceId;
                                var channelid = currentService.channelId;
							SumaJS.debug("playTv SWITCH_SCREEN: channelid = "+channelid);
                                //var params = "type=1&param_1="+fre+"&param_2="+sym+"&param_3="+mod+"&param_4="+serviceid+"&param_5="+videoPid+"&param_6="+audioPid;
                                params =
                                    "{" +
                                    "'ack':" + event_13001.syn + ","
                                    + "'data':{"
                                    + "'command':" + event_13001.data.command + ","
                                    + "'parameters':{"
                                    + "'result':1,"
                                    + "'message':'OK',"
                                    + "'caCardNo':'" + CA.icNo + "',"
                                    + "'type':1,"
                                    + "'tv_freq':" + fre + ","
                                    + "'tv_SymbolRate':" + sym + ","
                                    + "'tv_Modulation':" + "'" + mod + "'" + ","
										+ "'tv_ProgramNumber':" +  channelid + ","
                                    + "'tv_VideoPID':" + videoPid + ","
                                    + "'tv_AudioPID':" + currentAudioPid
                                    + "}"
                                    + "}"
                                    + "}";
                            }
                            else {
                                params =
                                    "{" +
                                    "'ack':" + event_13001.syn + ","
                                    + "'data':{"
                                    + "'command':" + event_13001.data.command + ","
                                    + "'parameters':{"
                                    + "'result':0,"
                                    + "'message':'No service',"
                                    + "'caCardNo':'" + CA.icNo + "',"
                                    + "'type':1,"
                                    + "'tv_freq':-1,"
                                    + "'tv_SymbolRate':-1,"
                                    + "'tv_Modulation':'-1',"
                                    + "'tv_ProgramNumber':-1,"
                                    + "'tv_VideoPID':-1,"
                                    + "'tv_AudioPID':-1"
                                    + "}"
                                    + "}"
                                    + "}";
                            }
                            SumaJS.debug("playTv SWITCH_SCREEN: send 13101 msg params = " + params);
                            //SysSetting.sendEvent(1001,13101, params);         
                            SysSetting.sendAppEvent(13101, params, 0, 0);       //code,modifiers,appid1,appid2  
                            return false;
						case 13002://三屏互动
                            var stbType = SysInfo.STBType;
                            SumaJS.debug("Wifi get message ROC_SYSEVENT_SWITCH_SCREEN(13002) stbType is" + stbType);
                            if (68 != stbType && 71 != stbType && 72 != stbType && 73 != stbType && 74 != stbType && 75 != stbType && 76 != stbType)
                                return;
                            SumaJS.debug("playTv SWITCH_SCREEN: Get switch msg");
                            var params;
                            var event_13002_modifiers = SysSetting.getEventInfo(event.modifiers);
                            SumaJS.debug("playTv SWITCH_SCREEN: event_13002_modifiers = " + event_13002_modifiers);
                            var event_13002 = eval('(' + event_13002_modifiers + ')');
                            SumaJS.debug("playTv SWITCH_SCREEN: event_13002_modifiers change to object = " + event_13002);
                            if (currentService) {
                                SumaJS.debug("playTv SWITCH_SCREEN: playTvObj.playService exist");
                                var currentAudioPid = 0;
                                currentAudioPid = currentService.audioArray[0].AudioPid;
                                SumaJS.debug("playTv SWITCH_SCREEN: audioPid = " + currentAudioPid);
                                var videoPid = 0;
                                var fre = currentService.tsInfo.Frequency;
                                var sym = currentService.tsInfo.SymbolRate;
                                var mod = currentService.tsInfo.Modulation;
                                if (currentService.serviceType == 1 || currentService.serviceType == 17) {
                                    videoPid = currentService.videoPid;
                                }
                                SumaJS.debug("playTv SWITCH_SCREEN: videoPid = " + videoPid);
                                var nid = currentService.networkId;
                                var tsid = currentService.tsInfo.TsId;
                                var serviceid = currentService.serviceId;
                                var channelid = currentService.channelId;
								SumaJS.debug("playTv SWITCH_SCREEN: channelid = "+channelid);
                                //var params = "type=1&param_1="+fre+"&param_2="+sym+"&param_3="+mod+"&param_4="+serviceid+"&param_5="+videoPid+"&param_6="+audioPid;
                                params =
                                    "{" +
                                    "'ack':" + event_13002.syn + ","
                                    + "'data':{"
                                    + "'command':" + event_13002.data.command + ","
                                    + "'parameters':{"
                                    + "'result':1,"
                                    + "'message':'OK',"
                                    + "'caCardNo':'" + CA.icNo + "',"
                                    + "'type':1,"
                                    + "'tv_freq':" + fre + ","
                                    + "'tv_SymbolRate':" + sym + ","
                                    + "'tv_Modulation':" + "'" + mod + "'" + ","
									+ "'tv_ProgramNumber':" +  channelid + ","
                                    + "'tv_VideoPID':" + videoPid + ","
                                    + "'tv_AudioPID':" + currentAudioPid
                                    + "}"
                                    + "}"
                                    + "}";
                            }
                            else {
                                params =
                                    "{" +
                                    "'ack':" + event_13002.syn + ","
                                    + "'data':{"
                                    + "'command':" + event_13002.data.command + ","
                                    + "'parameters':{"
                                    + "'result':0,"
                                    + "'message':'No service',"
                                    + "'caCardNo':'" + CA.icNo + "',"
                                    + "'type':1,"
                                    + "'tv_freq':-1,"
                                    + "'tv_SymbolRate':-1,"
                                    + "'tv_Modulation':'-1',"
                                    + "'tv_ProgramNumber':-1,"
                                    + "'tv_VideoPID':-1,"
                                    + "'tv_AudioPID':-1"
                                    + "}"
                                    + "}"
                                    + "}";
                            }
                            SumaJS.debug("playTv SWITCH_SCREEN: send 13102 msg params = " + params);
                            SysSetting.sendEvent(1001, 13102, params);
                            SysSetting.sendAppEvent(13102, params, 0, 0);       //code,modifiers,appid1,appid2  
                            return false;
                        case 11329:
                            freePreviewTipsControls.hide();
                            return false;
                        case 11330:
                            freePreviewTipsControls.show();
                            return false;
                        default:
                            if (val >= 11001 && val <= 11700 && val != 11536 && val != 11537 && val != 11569 && val != 11329 && val != 11330) {
                                if (val == 11506 || val == 11309 || val == 11030 || val == 11304 || (val >= 11331 && val <= 11337)) {
                                    if(val >= 11331 && val <= 11337){
                                        freePreviewTipsControls.hide();
                                    }
                                    playTvStatus = "02";
                                    playCAMsg = "频道未授权，如需订购请咨询当地营业厅或拨打客服热线96956";
                                    if (channelOrderFlag) {
                                        playTvListHandler.hide();
                                        channelOrder.reset();
                                        channelOrder.start(currentService);
                                        if (SumaJS.lastModuleName == "channel_list" && channelOrder_channelListToPlayTv_falg) {
                                            channelOrder.show(5);
                                            channelOrder_channelListToPlayTv_falg = false;
                                        } else {
                                            var actionStr = SysSetting.getEnv("DINGGOU_BACK_ACTION");
                                            if (actionStr) {
                                                var actionObj = JSON.parse(actionStr);
                                                if (actionObj.action != "success") {
                                                    SysSetting.setEnv("DINGGOU_BACK_ACTION", "");
                                                    if (channelOrder.isCanYulan) {
                                                        channelOrder.show(7);
                                                    } else {
                                                        channelOrder.show(1);
                                                    }
                                                }
                                            } else if (SysSetting.getEnv("PORTAL_BACKFROMYULAN_TMP") == "1") {
                                                SysSetting.setEnv("PORTAL_BACKFROMYULAN", "");
                                                channelOrder.show(8);
                                            } else {
                                                if (channelOrder.isCanYulan) {
                                                    channelOrder.show(7);
                                                } else {
                                                    channelOrder.show(1);
                                                }
                                            }
                                        }
                                    } else {
                                        showCaTip(playCAMsg);
                                    }
                                } else {
                                    if (channelOrderFlag) {
                                        channelOrder.exit();
                                    }
                                    playTvStatus = "03";
                                    playCAMsg = SysSetting.getEventInfo(event_modifer);
                                    showCaTip(playCAMsg);
                                }
                                document.body.style.background = "#000";
                                return false;
                            } else if (val >= 11801 && val <= 11900) {
                                if (val == 11814 || val == 11815) {
                                    playTvStatus = "02";
                                    playCAMsg = "频道未授权，如需订购请咨询当地营业厅或拨打客服热线96956";
                                    if (channelOrderFlag) {
                                        playTvListHandler.hide();
                                        channelOrder.reset();
                                        channelOrder.start(currentService);
                                        if (SumaJS.lastModuleName == "channel_list" && channelOrder_channelListToPlayTv_falg) {
                                            channelOrder.show(5);
                                            channelOrder_channelListToPlayTv_falg = false;
                                        } else {
                                            var actionStr = SysSetting.getEnv("DINGGOU_BACK_ACTION");
                                            if (actionStr) {
                                                var actionObj = JSON.parse(actionStr);
                                                if (actionObj.action != "success") {
                                                    SysSetting.setEnv("DINGGOU_BACK_ACTION", "");
                                                    if (channelOrder.isCanYulan) {
                                                        channelOrder.show(7);
                                                    } else {
                                                        channelOrder.show(1);
                                                    }
                                                }
                                            } else if (SysSetting.getEnv("PORTAL_BACKFROMYULAN_TMP") == "1") {
                                                SysSetting.setEnv("PORTAL_BACKFROMYULAN", "");
                                                channelOrder.show(8);
                                            } else {
                                                if (channelOrder.isCanYulan) {
                                                    channelOrder.show(7);
                                                } else {
                                                    channelOrder.show(1);
                                                }
                                            }
                                        }
                                    } else {
                                        showCaTip(playCAMsg);
                                    }
                                } else {
                                    if (channelOrderFlag) {
                                        channelOrder.exit();
                                    }
                                    playTvStatus = "03";
                                    playCAMsg = SysSetting.getEventInfo(event_modifer);
                                    showCaTip(playCAMsg);
                                }
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
            SumaJS.eventManager.addEventListener("caMsg", caMsg, 50);

            function showCaTip(msg) {
                var cfg = {
                    name: "ca_msg",
                    priority: 11,
                    boxCss: "info",
                    titleObj: {
                        title: "",
                        style: "title"
                    },
                    msgObj: {
                        msg: msg,
                        css: "msg_box1"
                    },
                    eventHandler: function (event) {
                        return true;
                    }
                };
                SumaJS.showMsgBox(cfg);
            }

            /***************************************** CA message end ****************************************/
            /***************************************** OSD ****************************************/
            var osdWidth = 1280;
            var osdShowTimer;
            var osdCharWidth = 0;
            var osdTextLeft = osdWidth;

            function showOSD(content, times, type) {
                SumaJS.getDom("osd").style.visibility = "visible";
                if (type == 0) {
                    SumaJS.getDom("osd").style.top = "25px";
                } else if (type == 1) {
                    SumaJS.getDom("osd").style.top = "330px";
                } else if (type == 2) {
                    SumaJS.getDom("osd").style.top = "632px";
                }
                SumaJS.getDom("test_str_len").innerHTML = content;
                SumaJS.getDom("test_str_len").style.fontSize = "48px";
                osdCharWidth = parseInt(SumaJS.getDom("test_str_len").offsetWidth, 10);
                //SumaJS.getDom("osd").innerHTML = "<div style='position:absolute;left:" + osdWidth + "px; top:0px; height:60px; width:" + osdCharWidth + "px; line-height:60px;' id='osd_text'>" + content + "</div>";
                SumaJS.getDom("osd").innerHTML = "<div style='position:absolute;left:"+ osdWidth + "px; top:0px; height:60px; width:" + osdCharWidth + "px; line-height:60px;' id='osd_text'>" + content + "</div>";
                osdTextLeft = osdWidth;
                clearTimeout(osdShowTimer);
                showOSDScroll(function () {
                    if (times > 1) {
                        times--;
                        showOSD(content, times, type)
                    } else {
                        hideOSD();
                    }
                    //CA.notifyOSDOver();
                });
            }
            function showOSDScroll(onFinishCallBack) {
                clearTimeout(osdShowTimer);
                osdTextLeft -= 4;
                if (osdTextLeft <= osdCharWidth * -1) {
                    if (onFinishCallBack) {
                        onFinishCallBack();
                    }
                } else {
                    SumaJS.getDom("osd_text").style.left = osdTextLeft + "px";
                    osdShowTimer = setTimeout(function () {
                        showOSDScroll(onFinishCallBack)
                    }, 50);
                }

            }
            function hideOSD() {
                SumaJS.getDom("osd").style.visibility = "hidden";
                SumaJS.getDom("osd").innerHTML = "";
            }

            /***************************************** OSD end ****************************************/

            /*************************************** channel info ************************************/
            var channelInfo;
        function channelInfoFun(){    
            channelInfo= {
                focus: 0,
                eventHandler: function (event) {
                    var val = event.keyCode || event.which;
                    if (event.type == 1001 || !this.focus) {
                        return true;
                    } else {
                        switch (val) {
                            case KEY_RED:
                            case KEY_ENTER:
                            case KEY_BACK:
                            case KEY_EXIT:
                                this.setFocusState(0);
                                return false;
                            default:
                                this.setFocusState(0);
                                return true;
                        }
                    }
                },
                setFocusState: function (type) {
                    if (type) {
                        this.focus = 1;
                        if (currentService) {
                            var currTs = DVB.currentTS;
                            SumaJS.getDom("channel_info_title").innerHTML = currentService.logicalChannelId + " " + currentService.serviceName;
                            SumaJS.getDom("chan_info_cell1_0").innerHTML = currentService.serviceId;
                            SumaJS.getDom("chan_info_cell1_1").innerHTML = currTs.modulation;
                            SumaJS.getDom("chan_info_cell1_2").innerHTML = currentService.videoPid;
                            SumaJS.getDom("chan_info_cell1_3").innerHTML = currTs.signalQuality;
                            SumaJS.getDom("chan_info_cell1_4").innerHTML = currTs.errorRate;
                            SumaJS.getDom("chan_info_cell3_0").innerHTML = parseInt(currTs.frequency / 1000, 10) + " MHz";
                            SumaJS.getDom("chan_info_cell3_1").innerHTML = currentService.pcrPid;
                            var audioPid;
                            if (currentService.audioArray instanceof Array) {
                                var trackSeq = SysSetting.getEnv("TRACKS_SEQ");
                                var audioIndex = 0;
                                if (trackSeq != "") {
                                    audioIndex = parseInt(trackSeq, 10);
                                    SysSetting.setEnv("TRACKS_SEQ", "");
                                }
                                audioPid = currentService.audioArray[audioIndex].AudioPid;
                            }
                            else {
                                audioPid = currentService.audioArray.AudioPid;
                            }
                            SumaJS.getDom("chan_info_cell3_2").innerHTML = audioPid;
                            SumaJS.getDom("chan_info_cell3_3").innerHTML = currTs.signalStrength;
                            SumaJS.getDom("chan_info_cell3_4").innerHTML = currTs.signalLevel;
                        }
                        playTvHandler.setFocusState(0);
                        SumaJS.getDom("channel_info_box").style.display = "block";
                    } else {
                        this.focus = 0;
                        SumaJS.getDom("channel_info_title").innerHTML = "未知";
                        SumaJS.getDom("chan_info_cell1_0").innerHTML = "未知";
                        SumaJS.getDom("chan_info_cell1_1").innerHTML = "未知";
                        SumaJS.getDom("chan_info_cell1_2").innerHTML = "未知";
                        SumaJS.getDom("chan_info_cell1_3").innerHTML = "未知";
                        SumaJS.getDom("chan_info_cell1_4").innerHTML = "未知";
                        SumaJS.getDom("chan_info_cell3_0").innerHTML = "未知";
                        SumaJS.getDom("chan_info_cell3_1").innerHTML = "未知";
                        SumaJS.getDom("chan_info_cell3_2").innerHTML = "未知";
                        SumaJS.getDom("chan_info_cell3_3").innerHTML = "未知";
                        SumaJS.getDom("chan_info_cell3_4").innerHTML = "未知";
                        SumaJS.getDom("channel_info_box").style.display = "none";
                        playTvHandler.focus = 1;
                    }
                }
            }
            SumaJS.eventManager.addEventListener("channelInfo", channelInfo, 96);
        }    
            /************************************** channel info end *********************************/

            //增强电视添加切台通知
            var changeChannelTimer = null;

            function ChannelChange(service) {
                playTvObj.playService.OriginalNetworkId = service.originalNetworkId;
                playTvObj.playService.NetworkId = service.networkId;
                playTvObj.playService.TsId = service.tsInfo.TsId;
                playTvObj.playService.ServiceId = service.serviceId;

                //alert(JSON.stringify(playTvObj));
                if (typeof(notifyStateChange) != "undefined") {
                    notifyStateChange(1, {
                        ornetworkid: playTvObj.playService.OriginalNetworkId, //要切到的频道的原始网络id
                        networkid: playTvObj.playService.NetworkId,// 要切到的频道的网络id
                        tsid: playTvObj.playService.TsId,// 要切到的频道的tsid
                        serviceid: playTvObj.playService.ServiceId//要切到的频道的serviced
                    });
                }
                if (channelNumIndex == -1 || channelNumId[channelNumIndex] != service.logicalChannelId) {
                    for (var i = 0; i < channelNumId.length; i++) {
                        if (channelNumId[i] == service.logicalChannelId) {
                            channelNumIndex = i;
                        }
                    }
                }
                clearTimeout(changeChannelTimer);
                changeChannelTimer = setTimeout(function () {
                    DataCollection.collectData(["04", service.channelId + "", service.serviceName, service.serviceId + "", service.networkId + "", service.tsInfo.TsId + "", changeTvMode, playTvStatus]);
                    //alert(playTvStatus);
                }, 1500);

                if (channelOrderFlag) {
                    var actionStr = SysSetting.getEnv("DINGGOU_BACK_ACTION");
                    if (actionStr) {
                        var actionObj = JSON.parse(actionStr);
                        if (actionObj.action == "success") {
                            SysSetting.setEnv("DINGGOU_BACK_ACTION", "");
                            channelOrder.show(3);
                        }
                    }
                }
                if (SysSetting.getEnv("PORTAL_BACKFROMYULAN") == "1") {
                    SysSetting.setEnv("PORTAL_BACKFROMYULAN_TMP", "1");
                } else {
                    SysSetting.setEnv("PORTAL_BACKFROMYULAN_TMP", "");
                }
            }
            //加载广告
            function refreshAd() {
                ADContrl.showAD("playTv");
                dealAdTimer = setTimeout(refreshAd, 120000);
            }

            try {
                refreshAd();
            } catch (e) {
            }

            /**************************信息界面广告*****************************/
           /* var infoAd = {
                adSelectShow: null,
                adIndex: 0,
                adUrl: "",
                imgDom: SumaJS.getDom("play_tv_info_list_ad_img"),
                getAdData: function () {
                    SumaJS.debug("infoAd getAdData");
                    this.adSelectShow = {};
                    this.adSelectShow.img = [];
                    this.adSelectShow.url = [];
                    var recommendData = JSON.parse(readFile("/storage/storage0/portalAd/recommend2.json", 3));
                    if (recommendData != null && typeof recommendData.recommendData != "undefined") {
                        if (recommendData.recommendData.length > 0) {
                            var temp1 = recommendData.recommendData;
                            for (var i = 0; i < temp1.length; i++) {
                                if (temp1[i].seque == 1 || temp1[i].seque == 2 || temp1[i].seque == 4 || temp1[i].seque == 5) {
                                    var temp2 = recommendData.recommendData[i].sourceData;
                                    for (var j = 0; j < temp2.length; j++) {
                                        if (temp2[j].areaType == "1") {
                                            this.adSelectShow.img.push(temp2[j].img[0]);
                                            this.adSelectShow.url.push(temp2[j].src);
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                showAd: function () {
                    SumaJS.debug("infoAd showAd");
                    if (!this.adSelectShow) {
                        this.getAdData();
                        if (this.adSelectShow.img.length > 0) {
                            this.showAd();
                        }
                    } else {
                        SumaJS.debug("adSelectShow.img = " + this.adSelectShow.img);
                        if (this.adSelectShow.img.length < 1) {
                            this.adUrl = "";
                            this.imgDom.style.display = "none";
                            SumaJS.getDom("play_tv_info_list_ad_key").style.display = "none";
                            return;
                        }
                        var picSrc = this.adSelectShow.img[this.adIndex].substr(this.adSelectShow.img[this.adIndex].lastIndexOf("/") + 1);
                        this.imgDom.src = "file:///storage/storage0/portalAd/" + picSrc;
                        this.imgDom.style.display = "block";
                        var url = this.adSelectShow.url[this.adIndex];
                        if (url == "" || url == "#") {
                            this.adUrl = "";
                        } else if (url.substring(0, 7) == "http://" || url.substring(0, 8) == "https://") {
                            this.adUrl = url;
                        } else if (url[0] == "/") {
                            this.adUrl = PORTAL_ADDR + url;
                        } else {
                            this.adUrl = PORTAL_SUB_ADDR + url;
                        }
                        SumaJS.getDom("play_tv_info_list_ad_key").style.display = "block";
                        this.adIndex = this.adIndex >= this.adSelectShow.img.length - 1 ? 0 : this.adIndex + 1;
                    }
                }
            }*/
            /**************************信息界面广告 END*****************************/
            var playTv_time = 0;
            if (SumaJS.lastModuleName) {
                playTv_time = 0;
            }
            var playFirst = false;
            if (serviceInfo.length >= 1) {
            	 playFirst = true;
                setTimeout(function () {
                    if (initParam && typeof (initParam.NvodSource) != "undefined") {
                        var sourceObj = initParam.NvodSource;
                        //smallHomeVideo.playNvod(sourceObj);
                        var source = "delivery://" + sourceObj.Frequency + "." + sourceObj.SymbolRate + "." + sourceObj.Modulation + "." + sourceObj.ServiceId + "." + sourceObj.VideoPid + "." + sourceObj.AudioPid;
                        SumaJS.globalPlayer.mediaPlayer.source = source;
                        SumaJS.globalPlayer.mediaPlayer.play();
                        currentService = null;
//                      try{
//                      	chanNumObj.setFocusState(1);
//                      }catch(e){
//                      	setTimeout(function () {
//                      		chanNumObj.setFocusState(1);
//                      	},1000);
//                      };
						//chanNumObj.setFocusState(1);  //add by liwenlei 解决nvod进全屏数字键不好用的问题
                    } else {
                        playServiceById(serviceInfo[currentSerIndex].logicalChannelId);
                        // playTvListHandler.show(1);//首次进入全屏显示列表内容
                    }
                   
                }, playTv_time);//最后加延迟时间，否则时移退回时直播可能播不了
            } else {
                StbFrontPanel.displayText("C");
            }

            function checkNewMail() {
                var mails = CA.getMails();
                if (mails) {
                    for (var i = 0; i < mails.length; i++) {
                        var mail = CAMails.getEmail(i);
                        if (mail && mail.readFlag == 0) {
                            SumaJS.getDom("mail_icon").style.display = "block";
                            return;
                        }
                    }
                }
            }

            checkNewMail();
            if (originalArray && originalArray.ProductOrder) {
                var tempFlag = originalArray.ProductOrder.BossAddr && originalArray.ProductOrder.TvBackAddr;
                if (tempFlag) {
                    channelOrderFlag = true;
                    TvHallUrl = "http://" + originalArray.ProductOrder.TvHallAddr + "/tvhall/portalvisit.shtml";
                    BossUrl = "http://" + originalArray.ProductOrder.BossAddr + "/boss2_task/integrate/integate!bossRequest";
                    TvBackUrl = "http://" + originalArray.ProductOrder.TvBackAddr + "/appweb/service/service!handleRequest";
                    TvPostUrl = "http://" + originalArray.ProductOrder.TvBackAddr + "/appweb/service/service!postRequest";
                }
            }
            if (channelOrderFlag) {
                channelOrder.init(TvHallUrl, TvBackUrl, BossUrl, TvPostUrl, 79);
                SumaJS.eventManager.addEventListener("channelOrderHandler", channelOrder, 31);
            }
            DataCollection.collectData(["01", "main://index.html?play_tv", SysSetting.getEnv("SOURCE_PATH"), "广播电视"]);
            SysSetting.setEnv("SOURCE_PATH", "main://index.html?play_tv");
        }

        function onDestroy() {
            clearTimeout(playTimer);
            clearTimeout(dealAdTimer);
            ADContrl.init();
            SumaJS.eventManager.removeEventListener("playTvListHandler");
            SumaJS.eventManager.removeEventListener("playTvSecondMenuListHandler");
            SumaJS.eventManager.removeEventListener("playTvHandler");
            SumaJS.eventManager.removeEventListener("chanNumObj");
            SumaJS.eventManager.removeEventListener("sysSettingPage");
            SumaJS.eventManager.removeEventListener("play_tv_epg");
            SumaJS.eventManager.removeEventListener("passwordBoxInput");
            SumaJS.eventManager.removeEventListener("caMsg");
            SumaJS.eventManager.removeEventListener("channelInfo");
            SumaJS.eventManager.removeEventListener("volumebar");
            SumaJS.eventManager.removeEventListener("zengqiang");
            SumaJS.eventManager.removeEventListener("eventInfoBox");
            SumaJS.eventManager.removeEventListener("relateInfoBox");
            SumaJS.eventManager.removeEventListener("favInfoBox");
            SumaJS.eventManager.removeEventListener("liveChannelTop");
            if (channelOrderFlag) {
                SumaJS.eventManager.removeEventListener("channelOrderHandler");
                channelOrder.exit();
            }
            //SumaJS.eventManager.removeEventListener("ETVHandler");
            SumaJS.eventManager.removeEventListener("rojaoAdvHandler");
            SumaJS.globalTimerManager.clearAll();
            changeTvMode = "00";
            epgScheduleList = null;
            if (SumaJS.msgBox) {
                SumaJS.eventManager.removeEventListener("messageBox");
                SumaJS.msgBox = null;
            }
            if (typeof(SysSetting.setLoadProgressFlag) == "function") {
                SysSetting.setLoadProgressFlag(1);
            }
            if (!playSuccess) {
                document.body.style.background = "#000";
            }
            if (playCAMsg) {
                SumaJS.releasePlayer();
            }

            SumaJS.$("#playtv_parent").style.display = "none";
        }

        return {
            onCreate: onCreate,
            onStart: function () {
                onStart();
            },
            onDestroy: function () {
                onDestroy();
            },
            parent: SumaJS.$("#playtv_parent")
        };
    })());
	
	//增强电视根据三要素切台方法
   function ETVSwitchChannel(networkId, tsId, serviceId) {
        for (var i = 0; i < SumaJS.globalServiceInfo.length; i++) {
            var services = SumaJS.globalServiceInfo[i].services;
            for (var j = 0; j < services.length; j++) {
                if (tsId == services[j].tsInfo.TsId && serviceId == services[j].serviceId && networkId == services[j].originalNetworkId) {
                    if (playFunc) {
                        playFunc(services[j].logicalChannelId);
                    }
                    break;
                }
            }
        }
    }
	
} catch (e) {
    alert(e.line + e.sourceURL + e.message)
}
