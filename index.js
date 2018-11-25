/**
 * @date :2018/11/25
 * @author :JessieKate
 * @email :lyj1246505807@gmail.com
 * @description : 客户端聊天室
 */


import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import React from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import SocketIOClient from 'socket.io-client';
import { GiftedChat,Bubble } from 'react-native-gifted-chat';

const USER_ID = '@userId';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],  // 显示的消息数组
            userId: null  // 用户id
        };
        // 注册回调
        this.determineUser = this.determineUser.bind(this);
        this.onReceivedMessage = this.onReceivedMessage.bind(this);
        this.onSend = this.onSend.bind(this);
        this.storeMessages = this.storeMessages.bind(this);
        // 初始化socket
        this.socket = SocketIOClient('http://192.168.199.151:3000');
        // 设置message消息监听
        this.socket.on('message', this.onReceivedMessage);
        // 用户判断
        this.determineUser();
    }

    /**
     * 当用户进入聊天室，检查该用户是否存在
     * 如果本地没有用户id，上报服务端获得一个id
     * 刷新本地的用户id
     */
    determineUser() {
        AsyncStorage.getItem(USER_ID)
            .then((userId) => {
                // 如果本地没有用户id，发送给服务端一个空的id，等待服务端返回一个id
                if (!userId) {
                    // 向服务端发送一个空的id
                    this.socket.emit('userJoined', null);
                    // 监听服务端发来的userJoined消息，保存服务端返回的用户id，刷新本地的用户id
                    this.socket.on('userJoined', (userId) => {
                        AsyncStorage.setItem(USER_ID, userId);
                        this.setState({ userId });
                    });
                }
                // 如果本地有用户id，直接发送给服务端，刷新本地的用户id
                else {
                    this.socket.emit('userJoined', userId);
                    this.setState({ userId });
                }
            })
            .catch((e) => alert(e));
    }

    /**
     * 当服务端发送message消息的回调处理
     */
    onReceivedMessage(messages) {
        this.storeMessages(messages);
    }

    /**
     * 点击发送按钮，向服务端发送这条消息，保存这条消息到本地
     */
    onSend(messages=[]) {
        this.socket.emit('message', messages[0]);
        this.storeMessages(messages);
    }

    /**
     * 客户端界面渲染
     */
    render() {
        let user = { _id: this.state.userId || -1 };

        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={this.onSend}
                user={user}
                renderBubble={this._renderBubble}
            />
        );
    }

    _renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: { //对方的气泡
                        backgroundColor: '#f7753f',
                    },
                    right:{ //我方的气泡
                        backgroundColor:'#2d2bfd'
                    }
                }}
            />
        );
    }

    // 刷新ui，在客户端的聊天界面上展示这些消息
    storeMessages(messages) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
    }
}


AppRegistry.registerComponent(appName, () => Main);
