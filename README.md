
```
Minecraft_Site
└─ mc-farm-timer
   ├─ eslint.config.js
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   │  ├─ favicon.svg
   │  └─ icons.svg
   ├─ README.md
   ├─ src
   │  ├─ App.css
   │  ├─ App.tsx
   │  ├─ assets
   │  │  ├─ hero.png
   │  │  ├─ react.svg
   │  │  └─ vite.svg
   │  ├─ components
   │  │  ├─ CropSelectro.tsx
   │  │  ├─ Layout.tsx
   │  │  └─ TimerCard.tsx
   │  ├─ data
   │  │  └─ crops.ts
   │  ├─ hooks
   │  │  └─ useInterval.ts
   │  ├─ index.css
   │  ├─ main.tsx
   │  └─ utils
   │     └─ calcTime.ts
   ├─ tsconfig.app.json
   ├─ tsconfig.json
   ├─ tsconfig.node.json
   └─ vite.config.ts

```

``` 보완 할 점
작물 성장 속도 실시간 가중치 적용:
현재는 App.tsx의 addTimer 함수에서 씨앗을 심을 때 getGrowthMinutes를 한 번만 호출하여 고정된 growthMinutes를 타이머에 넘겨주고 있습니다. 계절이 바뀌면 남은 시간에 새로운 계절의 속도 가중치를 곱해서 타이머 흐름을 조절하는 로직(예: 1초당 감소하는 harvestLeft의 양을 다르게 하거나, 남은 총량을 재계산)으로 개편이 필요해 보입니다.

물 주기 간격(Interval) 기준 변경:
현재는 타이머 생성 시점의 계절을 기준으로 waterInterval이 고정됩니다. "물을 준 시점의 계절을 따라간다"는 예상 로직을 반영하려면, TimerCard.tsx의 handleWater 함수가 실행될 때 그 순간의 계절 정보를 받아와서 24분(여름) 또는 48분으로 다음 waterLeft를 세팅하도록 수정해야 합니다.




```