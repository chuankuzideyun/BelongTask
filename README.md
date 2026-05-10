# BelongTask

一个基于 Expo + React Native 的移动端音乐奖励应用示例，参考了 Belong mobile app 的基础架构风格。

## 项目特点

- Expo Router 文件式路由
- Zustand 状态管理
- AsyncStorage 本地持久化
- React Native Track Player 音频播放
- 玻璃拟态风格 UI

## 主要功能

- Home 页面展示音乐挑战列表
- Player 页面支持真实音频播放、暂停和进度控制
- Profile 页面展示累计积分和完成进度
- Challenge Detail 页面展示单个挑战详情

## 运行方式

先安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run start
```

如果要运行真实音频播放，需要使用原生开发构建：

```bash
npx expo run:ios
```

或

```bash
npx expo run:android
```

## 技术栈

- Expo SDK 54
- React Native
- Expo Router
- Zustand
- AsyncStorage
- react-native-track-player

