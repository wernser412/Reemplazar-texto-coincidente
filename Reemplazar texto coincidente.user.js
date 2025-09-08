// ==UserScript==
// @name         Reemplazar texto coincidente
// @namespace    http://tampermonkey.net/
// @version      2025.09.08
// @description  Reemplaza texto y guarda/exporta datos entre múltiples sitios (usando GM_setValue). Exportación global funciona correctamente. Soporta reemplazos vacíos.
// @author       wernser412
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAIABJREFUeJzt3XuA1HW9//HX5zuXXWDZXVSw1OWO4jX0Z4l383oy62Sl51RaevJ0UhABQ1D7HafTMSEFEQE7XfXY3Tpamh2TzJQAuyii4oWbsGgKiyy7y7IzO/P9/P6wOv46arA7M+/5fr/Px19eYOaZbjMvv9+Z79e15Xu9EGttPdYFqLTxTRln3QAgWgLrAAAAUH0MAAAAEogBAABAAjEAAABIIAYAAAAJxAAAACCBGAAAACQQAwAAgARiAAAAkEAMAAAAEogBAABAAjEAAABIIAYAAAAJxAAAACCBGAAAACQQAwAAgARiAAAAkEAMAAAAEogBAABAAjEAAABIIAYAAAAJxAAAACCBGAAAACQQAwAAgARiAAAAkEAMAAAAEogBAABAAjEAAABIIAYAAAAJxAAAACCBGAAAACQQAwAAgARiAAAAkEAMAAAAEogBAABAAjEAAABIIAYAAAAJxAAAACCBGAAAACRQ2joAQLzM2zTpB5LOt+4wVHRSpyR5uR7J7/LSNidtk/dtCrRNoV6Rcy8GThvUm35x6uhbXrWORvIwAACgvNJeGvL6H3pJkpNGv/4H7vW/5F7/u6GXlC5q3qZJ3ZJWe2mV826V83rKpzIrp7fc/FrV65EYDAAAsDdQ0tFOOlrOyztJvuDnbZr0nOSXeWlpKuWXT93/tuetQxEfDAAAqE1O0sGSO9hJnw5LTvM2TXpVTr/wobs3CNMPThs1v906EtHFAACA6NhXXhc65y/0qd7eea2THnGh+2Em5X88+YBF26zjEC0MAACIpoy8TvPOn1YItWjepklLvPwP6uv1o0nDFndZx6H28TVAAIi+tKS/c3Lfyu9yL89rnfSfN2+8/HTrKNQ2jgAAQJw4DZbXhd6FF85rvewJ77Wgs3PYd3OH5grWaagtHAEAgLjy7kgn963GwVs3zd04OTevddpe1kmoHQwAAIi/fZ3z18kXNs7bOOnLN738mX2sg2CPAQAAydEgpxlBMfPiza2TZt+w8dIh1kGwwwAAgOQZ5L1m1rlg/c2tk69asObyOusgVB8DAACSq9l7P6dYF74wd+Nln7SOQXUxAAAAw51zd8xrnbTkpg2Tx1vHoDoYAACA13mdFqT8qptbJ80+/rk5g61zUFkMAADAG2W818wXUl1bTl8/g9MCMcYAAAD8L1t9qv6h4qA7jlw7a+lFG3L11j0oPwYAAOBNhZKeCOuPf6BY3Hra+mvOsO5BeTEAAABv648+3fBoKfvAcetmLbJuQfkwAAAAf1PByy0r1V928NprV5/yTK7Bugf9xwAAAOy2Z8PMwWuzxT+eve7ao61b0D8MAADAHtns0w2PhqnHTlw/6xLrFvQdAwAAsMc6fRAsL9Z97dgNs+Zbt6BvGAAAgD4pyumx3rorjls362fWLdhzDAAAQJ+FclpWqj/70HXXPHGePy9l3YPdxwAAAPTbM6XshFXrxr3wPr+AOwtGBAMAAFAWz4fZ0S+s2/LCecumDbBuwd/GAAAAlM26MD185dCBa07h8sE1jwEAACirNT6z/+ZiYc371lzO6YAaxgAAAJTdWp89YJ1rfCbneZ+pVa4t3+utI1BZbT3WBai08U0ZZ92wu37oz0ut27RPoyTVS0N8kN7Hye8t798Zyo10zo+U14GSDpXEJWeNTO8ZWpbHOSLI/37V2BveXZYHQ1kxABKAARB/URoAu8t7uRtbLx+d8aUj5dzxXjpO0pGSMtZtSVCuASBJ70713P27MbM/XLYHRFkwABKAARB/cRwAb2bRlssa8j3uNMn/neTOljTcuimuyjkAnKSJ6e4bl4/+8lVle1D0GwMgARgA8ZeUAfBG3svNf2nSRIU6X9L5XtrPuilOyjkAJCkjr2PTuy55ZPSXv1HWB0afMQASgAEQf0kcAG+U87mgadO2UxWEn/Fe50pKWzdFXbkHgCQ1uDB8T2bXux8aeePjZX9w7DEGQAIwAOIv6QPgjW7e8NmRSqc+673+RVKzdU9UVWIASNJ+rth5YCG938OH5roq8gTYbXw9A0CsTBv1lRentSya5UqZUc75nKQd1k34Hy/79OC2bM9S6w4wAADE1LRR89untSz+Qt6HoyR9SdIu6ya87mlf/673bLjmNuuOpOMUQAJwCiD+OAXwt9288dLRXsGtcjrbuiUKKnUK4M+yTv6koOfMJWNmL6noE+EtcQQAQCJMG3Hb+ukjFr1f3n9QThute5Ku4OVWh+m7L+KeAWYYAAASZfqIxfeWMgMO9d5/WVLRuifJXvbphqdKPT+z7kgqBgCAxJnxjpt2Xjli8Uwf+pMltVr3JNnKsO7UUzdefaF1RxIxAAAk1pUjFy/LBjpSzvFfoUZKclpVSH3t+OeuGmzdkjQMAACJNvmARdumHbDwA/JuqqSCdU8Stfl0XWcmdbd1R9Ik5lsAv3zwSXV2dltnmFi6/BnrBBPNzY367JXnW2dUBd8CKI+bN0861oe6W9K+1i3WKv0tgL+WkdepqZ1nPDDmJr4VUCWJuVzmvT9Zrs2bt1lnmHjl1ZetE0zU19cnZgCgPKYdsGj5jS9OPjYVhA9Ibpx1T5L0ymltWPc9SdVdHgnGKQAAeIMZIxduCIqZE+X8E9YtSbPOZ/Y5bu3ML1p3JAUDAAD+ytTRt7xaV6eTnPSgdUvSPOuzM09fN7PJuiMJGAAA8CYmDVvctaO084NO+ql1S5Js96nMa3Lfse5IAgYAALyF3Kjbe3Z0Dj2PIwHV9VyYPfsD62YOt+6IOwYAALyN3KG5QioffJTPBFRPtw/cZhfcYd0RdwwAAPgbpoy7tSOdTp0l6QXrlqR4tpQ5+ex10w+07ogzBgAA7IYp77x1q5x/v7y2WLckQY8P3Gaf5ShABTEAAGA3TW9ZvNZ7f66kXuuWJHjO1x9zyobcSOuOuGIAAMAeuHLk4mXOuc9bdyRBwct1hD2LrTviigEAAHto6gELb5T0E+uOJFgbZs76IDcKqggGAADsIefk8z68WE4brVvirsOngm0Zfdm6I44YAADQB1ePuG27C90nJBWtW+Juna/7pHVDHDEAAKCPpo1Y+Bt53WzdEXevhKmBx6+96lPWHXHDAACAfhiU6c1JetE4I/ZeU/oq64a4YQAAQD/8y35f7fbOfc66I+42+PTB5/3xam4VXEYMAADopytbFv5Y8j+37oizHh+4V7vD66w74oQBAABlUFTqckk91h1x1urT51k3xAkDAADK4Krht66Tc/OtO+JsY5gZ9t6XrjrIuiMuGAAAUCaumJ4jqd26I65CSTt3Bddad8QFAwAAymTaqPnt8lpg3RFnbUr9nXVDXDAAAKCM8grnS+qy7oir1jA99NzOzw2z7ogDBgAAlNHVI27bLqdvWnfEVa+cXn01dbl1RxwwAACgzEolN19SybojrrYr+LB1QxwwAACgzGaMXLhBXg9Yd8TVSz5zoHVDHDAAAKACnHNfs26Iqw4fpM9YM+Nk646oYwAAQAXsaNnnPkmvWHfEVVeQ/ph1Q9QxAACgAnIuV/Red1l3xNUO7060bog6BgAAVEgg9wPrhrjapmC0dUPUpa0DquW0M49U+/ad1hkmli5/2jrBxJAhg60TkHA7hu+zvLF160uS9rduiZstYbr+1PXXjnho9PUbrVuiyrXle711BCqrjduTxN74poyzbsCbm7tx0tec0yXWHXtqek/t33n3hNSuK5eOmTPPuiOqOAUAABUUBNwmuFJ6fHC8dUOUMQAAoIJSPaklkorWHXG0S+5g64YoYwAAQAVNGXdrh5N70rojjjq9O8C6IcoYAABQYd6FS60b4mibUg3WDVHGAACASgvdMuuEONrpA3fmhqvHW3dEFQMAACosFaSesG6Iq52+xAcB+4gBAAAVtv2AvdZJSuaFSCos9O5Q64aoYgAAQIXlXC700mrrjjgKfTDGuiGqGAAAUBVurXVBHOWdf6d1Q1QxAACgCpz8BuuGONrlU3tZN0QVAwAAqsA5MQAqYJdXk3VDVDEAAKAaSuEfrRPiKC83wLohqhgAAFAFLhW0WTfEUUkuY90QVQwAAKiCUH6bdUMcleRT1g1RxQAAgCpIp1M7rBviqKiAW2H3EQMAAKqhS3nrhDgqejEA+ogBAADVwQCogF45BkAfMQAAoApeG7t3r3VDHJWsAyKMAQAAVXCdct66IY44A9B3DAAAABKIAQAAQAK5tnwvh6Virq3HugCVNr4pk7jjoDdvvOyjcu6r1h17wktDrBt21/SeodYJu22Awki9j01I985dPvqGGdYdDIAEYADEXxIHgCTNa530n/K60LojjqI0AKJkbKqwae2YL42w7pA4BQAgwurq/GXyet66A9gdQ1TqHV90x1l3/BkDAEBkTRq2uCsIwvMlcZwLNS0trwmpwkX3HXT9S9Ytf8YAABBpU1tuWyXvZll3AG9nQrrwo1+NmfNd6443YgAAiLxpwxcu8PL3WHcAb2Zk0LvlnFE3/IN1x19jAACIPOfkC97/k5w2WrcAb9ToSqVxrnBCzim0bvlraeuAanloyZPq7Oy2zjCxdPkz1gkmmpob9dnp51tnoEquHnHb9ps2XnZB4NyvlKDXNtSuQNK7gt7JD465cY11y5tJzNcAp07+ijZvTubtuF959WXrBBP19fX6/s/nWmdURVK/Bvhm5m2a9HlJX7TuiDq+Bth/E1z+wZXjbjjTuuOtcAoAQKx0tAz9kuSXWHcg2VpcsX3c2LpzrDveDgMAQKzkXC4MipkLJL1i3YJkGuTC8KBM8dS7XK5g3fJ2GAAAYmfq6FteDeQukmrvg1eINyevI4L8vy8ZOfsJ65a/hQEAIJamDl/4gPf+JusOJMthrnfF8jFzrrPu2B0MAACx1Tl82LVyWmbdgWR4pyvu3LuQPcO6Y3cxAADEVs7lij7w/yjpNesWxFu9Qn+w7z374UNzXdYtu4sBACDWrtx/cat37jPWHYi3CUF+4UMHznnEumNPMAAAxN6VLQt/LPmvWHcgng4OCk+vGDtninXHnmIAAEiEjlL3NHmttO5AvAx1pZ7hddmTrTv6ggEAIBFyo27vSQWp8+XVad2CeMgq1GFB4aMPtOQi+RkTBgCAxLiiZcEaOXeFdQfiYUIq/41fjZnzM+uOvmIAAEiU6cMXfkvef9u6A9E2NlXY9Nsxcy6x7ugPBgCAxKkboEvl9bx1B6JpiEq944vuOOuO/mIAAEicScMWdwVBeL6kHusWREtaXhNShYvuO+j6l6xb+osBACCRprbctkrezbLuQLRMSBd+9Ksxc75r3VEODAAAiTVt+MIFXv4e6w5Ew8igd8s5o274B+uOcmEAAEgs5+QL3v+TnDZat6C2NbpSaZwrnJBz8bnDJAMAQKJdPeK27fLBhZKK1i2oTYGkI4L8lAfH3LjGuqWcGAAAEm/68FsfdfL/Zt2B2nREkF+ydMyXF1t3lBsDAAAk7WgZdr3kl1h3oLa0uGL7uDF177fuqAQGAABIyrlcGBQzF0h6xboFtWGQC8ODMsVT73K5gnVLJTAAAOBPpo6+5dVA7iIpPh/0Qt84eR0R5P99ycjZT1i3VAoDAADeYOrwhQ/Ia651B2wdFvSuWD5mznXWHZXEAACAv9IxfOg18lpu3QEb73DFnXvns2dYd1QaAwAA/krO5YqpTPofJUXyNq/ou3qF/hDfe/bDh+a6rFsqjQEAAG/iiv1u2eSd+4x1B6prQpBf+NCBcx6x7qgGBgAAvIUrWxb+WPJfse5AdRwS5J9ZMXbOFOuOamEAAMDb6Ch1T5PXSusOVNZQV+ppqas7ybqjmtLWAdVy2hlHqr099qd03tTSZU9ZJ5ho3qvJOgExkBt1e88trVPOL4WlP8hpsHUPyi+rUIcFhY8+0DInUZ/5cG35Xm8dgcpq447nsTe+KeOsG+Lu5k2T/slL37DuqJbpPUOtE6rmPald3/jtmDmXWHdUG6cAAGA3TBu+6Jvy/tvWHSivsUFvaxLf/CUGAADstroBulRez1t3oDyGqNQ7vqRjrTusMAAAYDdNGra4KwjC8yVxYi3i0vKakCpcdN9B179k3WKFAQAAe2Bqy22r5N0s6w70z4Sg579+NWbOd607LDEAAGAPTRu+cIGkn1h3oG9GBr1bzhkz5zzrDmsMAADYQ87J5314sZw2WrdgzzS6UmmcK5yQc9zxkQEAAH1w9YjbtssHF0oqWrdg9wTyele6d8aDY25cY91SCxgAANBH04ff+qiT/zfrDuyeI4LCkkdHzb7ZuqNWMAAAoB92tAy7XvJLrDvw9g4Iiu3jxtS937qjljAAAKAfci4XBsXMBZJesW7BmxvkwnB8unjqXS5XsG6pJQwAAOinqaNveVXOXyzxwbJa4+R1RJD/9yUjZz9h3VJrGAAAUAbTWxb/t7zmWnfg/3dYqvDY8jFzrrPuqEUMAAAok47hQ6+R13LrDrzuHa64c++eutOtO2oVAwAAyiTncsVUJv2PkhJ1W9laVK/QH+J7z3740Fwy7wO/GxgAAFBGV+x3yybv3GesO5LuyKCw6KED5zxi3VHLGAAAUGZXtiz8sZP+w7ojqQ4J8s8sHzv7cuuOWufa8r3eOgKV1cZ9y2JvfFPGVfP5Orzfp5rPF0Xrdz1Z93DbN/87VOkw65a+mN4z1DqhT4YpLNyx7ydOOLruwB3WLbWOAZAADID4q/YA4HVj93SW2nTftpvU66P3f8IoDoCs8/pO83k6PHuQdUokcAoAACpkcGofvXvwudYZiTFl4GG8+e8BBgAAVNDYAcdodP3R1hmxNzE9UJc0fMg6I1IYAABQYRMbz1Njaph1RmwNdV7zh3zaOiNyGAAAUGFpV6cTmy5U4NLWKbGTltfcpg+oOWi0TokcBgAAVMHemRYd1fAB64zY+ecBY/SeundZZ0QSAwAAquSQgSeppe5w64zYmJDOakrjP1hnRBYDAACqxum4xo+pIbWXdUjkNTtpQfNFcryN9Rn/5ACgiuqCgTqh8QIFvPz2WSCvLzaeomGp6F2roJbwEwgAVTYsO1pHNJxlnRFZH68/QGfUH2+dEXkMAAAwcPigM/XO7IHWGZEzPpXSrKYLrTNiITHfSXnol6vU2dFtnWFi6fLV1gkmmvcarH+Zep51BvCmnJxObLpQ9267UbvCDuucSGhwXrc2f1JppaxTYiExA+Cndy/T5s3brDNMvPLqy9YJJurr6xkAqGn1wWAd1/Qx/XL7VyVxe4W34+R1bcNEtaT3s06JDU4BAICh/bMH65CBp1hn1LwP1Q3TuQNPt86IFQYAABg7avAHNDQz0jqjZo1KOeUaL7LOiB0GAAAYCxTopOZPqS4YaJ1ScwbIa0HTJ1QXZK1TYocBAAA1YFAwRBMHn2+dUXOubJigcZkR1hmxxAAAgBoxon6CDhx4nHVGzTgz26QLBp1jnRFbDAAAqCHvbjhXQ/iku/YPnG5o5ha/lcQAAIAaknIZndx8sTKu3jrFTNZ5zW/6iAa5AdYpscYAAIAa05gaqqMHn2udYWbKwMN0ePYg64zYYwAAQA0aN+AYja4/2jqj6iamB+qShg9ZZyQCAwAAatTExvPUmBpmnVE1Q53X/CGc968WBgAA1Ki0q9OJTRcqcPG/antKXrObzlZz0GidkhgMAACoYXtnWnRUwwesMyrunweM1fF1R1lnJAoDAABq3CEDT1JL3eHWGRUzIZ3VFY1cBKnaGAAAUPOcjmv8mBpSe1mHlF2zkxY0XyTH21HV8U8cACKgLhioExovUBCjl20n6d8Gn6JhqaHWKYkUn58kAIi5YdnROrzhLOuMsvlE/f46c8Dx1hmJxQAAgAg5YtCZemf2QOuMfhufSmlW04XWGYnGAACACHFyOrHpQg2I8NflGpzXrc2fVFop65REYwAAQMTUB4N1XNPH9PpZ9Ghx8rq2YaJauOGROQYAAETQ/tmDdcjAU6wz9tiH6obq3IGnW2dADAAAiKyjBn9AQzMjrTN226iUU67xYusM/AkDAAAiKlCgk5o/pbpgoHXK3zRAXguaPqG6IGudgj9hAABAhA0Khmji4Nq/it6VDRM0LjPCOgNvwAAAgIgbUT9BBw48zjrjLZ2ZbdIFg86xzsBfYQAAQAy8u+FcDanBT9bvF0izh3DevxYxAAAgBlIuo5ObL1ba1Vmn/EXWec1v+ogGapB1Ct4EAwAAYqIxNVTvHvxh64y/mDLwUB2RHW+dgbfAAACAGBk34BiNrj/aOkMT0wN1ScO51hl4G2nrgGo59fQJam/faZ1hYumyp60TTDQPabBOAExMbDxPbb2b1FHaYvL8Q53X/CGfNnlu7D7Xlu/11hGorLYe6wJU2vimTFWvCcvrRu3b1tuqn2+/RaEv9un3T+/p2y16U/L6avPZOr7uqD79flQPpwAAIIb2zrToqIbqf/XunweM5c0/IhgAABBThww8WS11h1ft+Saks7qisfYvSoTXMQAAILacjmv8mBpSe1X8mZqdtKD5IjneViKDf1MAEGN1wUCd0HhBRd+YnaR/G3yKhqX69rkB2GAAAEDMDcuO1hENZ1Xs8T9Rv7/OHHB8xR4flcEAAIAEOGLQmXpn9sCyP+74VEqzmi4s++Oi8hgAAJAATk4nNl2oAUFj2R6zwXnd2vxJpZUq22OiehgAAJAQ9cFgHdf0Mb1+1r5/nLyubZiolhq8ARF2DwMAABJk/+zBOmTgKf1+nA/VDdW5A0/vfxDMMAAAIGGOajhHQzMj+/z7R6Wcco3c4jfqGAAAkDCBS+mk5k+pLhi4x793gLwWNH1CdUG2AmWoJgYAACTQoGCIJg7e86v2XdkwQeMyIypQhGpjAABAQo2on6BxA4/d7V9/RrZJFwyq/v0FUBkMAABIsPc0fFhDduOT/PsF0pwhnPePEwYAACRYymV0YtOnlHJvfU4/I+mmpr/XQA2qXhgqjgEAAAnXnN5X7xn8kbf8+1cMOkRHZQ+rYhGqgQEAANC4AcdoVP3R/+uvT0wP1CUN5xoUodIYAAAASdKxjeepMTXsL38+1HnNH/JpwyJUEgMAACBJSrs6ndh0oVIupZS8ZjedreYy3jsAtSVtHYBK8/LyFb0XOID42DvToiMbPqBL9LKOrzvKOgcV5Nryvd46ApWzuvthfafrZU1r/Lh1CipofFOm/3d32QO8bsSd19Ye/sMh7vi3G2Pbelv1RNe9+vqu9fpN/nHrHACR4XjzTwD+DcdU0ef16I47VfIlleQ0a8f9ag87rLMAADWCARBTyzvuUkdpy1/+fKt3mrr9G4ZFAIBawgCIoTW7HtOGnt//r7++otitr3fdbVAEAKg1DICYaS++qt92/vgt//4tO1fr8cLTVSwCANQiBkCMlHyvHt1xh0q+8Ja/plfS53b8RN3aWb0wAEDNYQDEyG+7/kvbiy//zV/3cijN3P6tKhQBAGoVAyAmNvas1Jru5bv96x8s7NC3d95XwSIAQC1jAMTAznC7VnT+cI9/39yulVrTu7ECRQCAWscAiLjQl/RI+x3Kh917/Ht3yWnKju8oH771ZwYAAPHEAIi4x7vu09beF/v8+zeUvHIdfB4AAJKGARBhLxWe1eruh/v9OPfkt+ru7iX9DwIARAYDIKJ6wk4t2/E9Sf2/J4uX0/VdK9S6G98gAADEAwMggry8Ht1xp3aV8dr+Xd7p8vb/VFGlsj0mAKB2MQAiaNXOX+iPhRfK/rjPlUqavePOsj8uAKD2MAAiZkthvVZ1PVCxx/9Oz0v6xa7fVOzxAQC1gQEQIfmwW0s7vi2vsGLP4SX9a+fD2lLaWrHnAADYYwBEhteyju+pq/RaxZ+p3UtT2m+v6NAAANhiAETE6u5H1Jp/qmrPt7JY0C0de351QQBANDAAImBbb6se77q36s/7tV1r9Zv841V/XgBA5aWtA/D2ij6vR3fcqdAXq/7cJTnN2nG/7t1nrJqDxqo/P2Dtp/esUHt7Mm+dvXTZ09YJJpqHNOiqL3zaOqMqGAA1bkXHXeoobTF7/q3eaer2b+j2vaeZNQBWHlqyUps3b7POMPHKq8m8MFh9fZ11QtVwCqCGrdn1mNb3/N46QyuK3fp6193WGQCAMmIA1KiO0lb9vrN23nQXdD+jVYXnrDMAAGXCAKhBJd+rX7d/S72+xzrlLwreaeqOH6tbyTwfCgBxwwCoQb/rulvba/DGPC+H0qzt3DoYAOKAAVBjNvas1Avdy6wz3tIvCjv07Z33WWcAAPqJAVBDdobbtaKz9i++M7drpdb0brTOAAD0AwOgRoQK9Uj7HcqH3dYpf9MuOU3Z8R3lw4J1CgCgjxgANeLxznu1tfdF64zdtqHklevg8wAAEFUMgBrwUuFZre5+2Dpjj92T36q7u5dYZwAA+oABYKwn7NSyHd/T6zfijRYvp+u7Vqi1Br+xAAB4ewwAQ15ej+64U7vCDuuUPuvyTpe3/6eKKlmnAAD2AAPA0FM7f6E/Fl6wzui350olzd5xp3UGAGAPMACMbCms16quB6wzyuY7PS/pF7t+Y50BANhNDAAD+bBbSzu+rVChdUrZeEn/2vmwtpS2WqcAAHYDA6DqvJZ1fE9dpdesQ8qu3UtT2m+Xj9GwAYC4YgBU2eruR9Saf8o6o2JWFgu6paP2r2YIAEnHAKiibb2terzrXuuMivvarrX6Tf5x6wwAwNtgAFRJ0ef16I47FfqidUrFleQ0a8f9ao/w1xsBIO4YAFWyouMudZS2WGdUzVbvNHX7N6wzAABvgQFQBWt3Pab1Pb+3zqi6FcVufb3rHusMAMCbYABUWGepTb/rvNs6w8yC7qf1VOF56wwAwF9hAFRQyffq4fZvqdf3WKeYKXinqTt+rJ1+l3UKAOANGAAV9Luuu7W9+JJ1hrmXQq+r2/k8AADUEgZAhWzMP6kXupdZZ9SMXxR26Ns777POAAD8CQOgAnaG27Wi4wfWGTV0GF2fAAAUj0lEQVRnbtdKrendaJ0BABADoOxChXqk/Q7lw27rlJqzS05TdnxH+bBgnQIAiccAKLMnOu/T1t4XrTNq1oaSV67jdusMAEg8BkAZvVR4Vqu7f2WdUfPuyW/R3d1LrDMAINHS1gFx0RN2atmO78nLW6fUPC+n67tW6OjsIWpJ72edA7ylD557nDo7knk6b+ny1dYJJpqGNFgnVI1ry/fyjtVPXl5Ltt+mPxZesE55U9N7hlonvKnxqZR+tM8MpZWyTom88U0ZV83n43Uj/tqSe/mSxOAUQBk8tfMXNfvmX8ueK5U0e8ed1hkAkEgMgH7aUlivVV0PWGdE1nd7NuvBnt9YZwBA4jAA+iEfdmtpx7cVKrROiaxQTv+342FtKW21TgGARGEA9JnXso7vqav0mnVI5LV7aUr77fIMKQCoGgZAHz3b/aha809ZZ8TGymJBC7h6IgBUDQOgD7YXX9bjXfdaZ8TO13at02/zT1pnAEAiMAD2UNHn9ev221XyvdYpsVOU05U77lV72GGdAgCxxwDYQys67lJHaYt1Rmxt9U5Tt3PrYACoNAbAHli76zGt7/m9dUbsrSh26+td91hnAECsMQB2U2epTb/rvNs6IzEWdD+tpwrPW2cAQGyls9l0bV4ntoas3/Vk3cNt3/zvUKXDrFuSouCdJm3/YeGOfT9xwtF1B+6w7gGAuKnq9cOjat6my26T3GetO/qqVu8FsDsOCfLPrB57A8OrxnAvgPjjXgDxxymAv2Fu6+SPRPnNP+pWh3WHHrt21q3WHQAQNwyAtzH3pctanPdfte5IuifC7KRTX5h5knUHAMQJA+At5Hwu7UL3fUl7WbckXY8Ct9pl7j/lmVxybtQNABXGAHgLjZu2fklex1l34HWv+PSgbfX5JdYdABAXDIA3MX/T5LPkdKV1B/5/T5eyxxy7buYXrDsAIA4YAH9l/vor9g3lbxf/bGqOl9OqsO7zp78460jrFgCIOt7k3iDnc0GY7v22pHdYt+DN7fRB8Fwx/dB5Ppe1bgGAKGMAvEFj69ZrJHe6dQfe3uYw3bxmXf5n1h0AEGUMgD+Zt+nyEyVdZ92B3bMqzJ5+4oZZ06w7ACCqGACSbth46RC58E5JaesW7J5QTk8WMzeesW7GOOsWAIiixA8A7+Wyzn1TXiOsW7BnOnwqtcZnl+Y8P8cAsKcS/8J586bJU5zch6w70Dcvhplh962beZd1BwBETaIHwPzWS4+Q87OtO9A/K8P6D7933cyPW3cAQJQkdgAs2nJZQxgGP5RUb92C/inKaWUpe/s5z1+7v3ULAERFYgdAfpduk9NB1h0oj+1KZZ5Labl1BwBERSIHwLxNky+WcxdYd6C81oaZlvesm/l16w4AiAJnHVBtt7ROGVcKS3+Q02DrlmqZ3jPUOqFqsgp1fCp/zq/GzOFCQRXUlu/11g3VcO9PHlN7e5d1homly56yTjDRvFeTZlx3sXVGVSTqe++5DRfVl8LSD5P05p80BQV6Osz+6KzW3P4PtORes+5BtP3ywSe0efM26wwTr7z6snWCifr6OuuEqknUKYDG1MCb5TTBugOVtdWn6lvz+UesOwCgliVmAMxtnfwRyX3WugPVsTqsO3Ti2pkLrDsAoFYlYgDMfemyFuf9V607UF0rw7rJp74w8yTrDgCoRbEfADmfS7vQfV/SXtYtqK4eBW61y9x/yjO5BusWAKg1sR8AgzdtuV5ex1l3wMYrPj1oW13hQesOAKg1sR4A8zdNPss59znrDth6OsxMPHbdzC9YdwBALYntAJi//op9Q/nbFeP/jdg9Xk6rwrrPn/7irCOtWwCgVsTyzTHnc4FPF++U9A7rFtSGnT4Inu9NP3Sez2WtWwCgFsRyADS2br3GS2dYd6C2tPp085p1ea4QCACK4QCY3zrpGEn/at2B2rQqrDv9hHVXXWbdAQDWYjUAbth46ZBQ+oGkjHULalMoaVVYt+CMdTPGWbcAgKXYDADv5bLOfVNeI6xbUNs6fCq1xmeX5nx8fv4BYE/F5gVw3qZJlzu5D1l3IBpeDDPD7ttw9Q+sOwDASiwGwLzWyYc7pznWHYiWlcXsR9+7bubHrTsAwELkB8CiLZc1SP6HkuqtWxAtRTmtLGVvP+f5a/e3bgGAaov8AMjn3WJ5jbfuQDRtVyrzXNovs+4AgGqL9ACYt2nyxfK60LoD0ba2lB3+nnUzv27dAQDVFNkBcEvrlHHy/hbrDsTDylLdp9+7bub7rTsAoFoiOQAWrLm8rhSWfiinwdYtiIeCAj0dZn90VmuO20YDSIRIDoBSXXiznCZYdyBetvpU/aZ84dfWHQBQDZEbAHNbJ3/ES5dadyCeng2zh01cO3OBdQcAVFqkBsDcly5rcd5/1boD8bYyrJt86gszT7LuAIBKiswAyPlc2oXu+5I4R4uK6lHgnnWZ+095Jtdg3QIAlRKZAdC0eeu/y+s46w4kwx99etC2bOFB6w4AqJRIDID5myaf5b1mWHcgWZ72mYnHrpv5BesOAKiEmh8A89dfsW8of7si0Ip48XJaFdZ9/vQXZx1p3QIA5VbTb6o5nwt8uninpHdYtyCZdvogeL43/dB5Ppe1bgGAcqrpATC4te1qL51h3YFka/Xp5jVr8/dZdwBAOaWtA97K/NZJx4TeX2fdAUjSKl93xonrZn320TGzv2Ldgur54IeOVWdnt3WGiaXLn7FOMNHc3GidUDXOOuDN3LDx0iF1Lnhc0kjrljiY3jPUOiEWGl2pdEzQc/CDY25cY91irS3f660bUFltPdYFqLSaOwXgvVzWuW+KN3/UmA6fSq3x2aU5X3v/vwGAPVVzL2TzNk263Ml9yLoDeDMvhplh9224+gfWHQDQXzU1AOa1Tj7cOc227gDezspi9qPvXTfz49YdANAfNTMAFm25rEHyP5Q0wLoFeDtFOa0sZW8/5/lr97duAYC+qpkBkM+7xfIab90B7I7tSmWeS/tl1h0A0Fc18S2Aua2TPxJ4/zXrjj3hpSHWDbsrSt8CGKAwUp8un5Dunbt89A2Ju0w13wKIP74FEH81MQCiaN6mSZF5AYzSANCBOX4mI4ABEH8MgPirmVMAAACgehgAAAAkEAOg7zgEWgFcZAcAqoMX274rWgfE0R/+kKu3bgCAJGAA9F3BOiCO8s1qsG4AgCRgAPRd3jogjop+52DrBgBIAgZA33EEoBJ8wNX1AKAKGAB9t8s6II58wF0gAaAaGAB9t806II56Aw23bgCAJGAA9JFnAFREwbtR1g0AkAQMgD5yDICK6AndGOsGAEgCBkBfObVZJ8RRTxAcYN0AAEnAAOgjH+oV64Y46grdMOsGAEgCBkAfBc6/aN0QR9sUNHA5YACoPF5o+ygM/AbrhjjK+8D9+sUZJ1p3AEDcMQD6KFXIMgAqpMenz7FuAIC4YwD00RWjbtkiqdu6I446vd5r3QAAcccA6CPn5J3cs9YdcbQtTB1k3QAAcccA6Acvv8q6IY62+FTDB9dfs691BwDEGQOgH7wXA6ACSnJqC0uTrTsAIM4YAP0QeMcAqJB2BedaNwBAnKWtA6Isk/ZPFkJ5Sc66JW5eCtMH5byCnFNo3YLkuvenj6l9+07rDBNLlz9tnWCiechgzbjuYuuMqmAA9MPkAxZtm9c66Xl5jbduiZsdSqUfWj/rImn2N61bkFy//MUT2rw5mbf9eOXVl60TTNTX11knVA2nAPrL+99YJ8TVaz6YZN0AAHHFAOi3gAFQIRt96l3n+VzWugMA4ogB0E9BqrTMuiGuOn0qtXn9rmutOwAgjhgA/TR1/9uel7TJuiOuXvGZz1g3AEAcMQDKwbsHrBPiamOYfsfpz195gnUHAMQNA6AMXBD+t3VDXIWS/pjKLrDuAIC4YQCUQaontURSr3VHXK31mQmnrr92hHUHAMQJA6AMpoy7tUNOj1h3xFXeB267D7keAACUEQOgTFzofmjdEGfPhpn3nrpmxhjrDgCICwZAmZQyhf8SpwEqpscHbptL32HdAQBxwQAok8/t99U2Lz1k3RFnq8Ps8e/dMONk6w4AiAMGQFn571sXxFmvnNYXs3dZdwBAHDAAyqi+Xj+S1GHdEWcbfWbo8etm3mDdAQBRxwAoo0nDFnfJiaMAFfZUmJ3xwfXX7GvdAQBRxgAoN+++Zp0Qdx0+ldpQ0j3WHQAQZQyAMps+fOHv5fwT1h1x94zPTjzxhas+a90BAFHFAKgEH9xqnRB3oaQnXd3C0zZPP9C6BQCiiAFQAYO2FL4tabN1R9x1+FRq3a4BS3Oen2MA2FO8cFbAvxz91V7vtdi6Iwle9JmhP10/i88DAMAeYgBUSEHhVyR1WXckwZOlug+cuH7GJdYdABAlDIAKuXrEbdvldZt1RxKU5PR4acB/nPDCrNOtWwAgKhgAFZRNaY68Oq07kmCnD4KnXeb+09Z/7gjrFgCIAgZABU0+YNE25/wC646kaPepzFPhgMdOXX/tCOsWAKh1DIBKK2VvctJ264yk2BKm6teU3MpTNkxttm4BgFrGAKiwaaPmt8u52dYdSdLq080bi4Oefd+aXKN1CwDUKgZAFezo2Ge+5NdYdyTJBp95x1OuuPHMtde2WLcAQC1iAFRB7tBcwSm4yrojaTaH6eYnfPDCe9fO+j/WLQBQaxgAVTJt+MJ7JPcL646k2epT9U+EmRWnrp91pnULANSStHVAkoQlXRGk9ISkeuuWJGlXKv3bkvv5SWtnXvbI2Dn/Yd2D6PjA3x+rzs5u6wwTS5c/Y51gork5OR8dctYBSTNv06TPS/piNZ9zes/Qaj5dzQokHebyv95rbN3pD7tc0bonytryvd66AZXV1mNdgErjFECVdbQMnc3tgm2Eklb5upPXry2+eubaaw6z7gEASwyAKsu5XFFKfVZSybolqTb59F4rfGrl8euu+qx1CwBYYQAYmN5y62/ldb11R5J1+FRqeWngbYevu3rFmWtzw6x7AKDaGABGOoYP/aK8llt3JFko6alS3THLFb58zNpZfDgQQKLwIUBDN2+8dLR3wROSKvqxUz4EuHtagt7tY13hgl+NufF+65Zax4cA448PAcYfRwAMTRtx23rv3CTrDryuNcwMebQ08GeHr7lm+alrZoyx7gGASuIIQA2Yu2nSQidVbAhwBGDP1Tn5g5R/ZB8VP/3QuBvXWffUGo4AxB9HAOKPIwA1oGFL7zTJP2rdgf+R93KrfN3JS/2AtQevvXY1VxIEEDccAagRczZN3i8j/wdJ7yj3Y3MEoP+cpAOCYts7g+K3Uplh1y1vmb7LuskSRwDijyMA8ccAqCFzN1860YXBQ5IGlPNxGQDl1aAwHJHqfWov+a+cNnr2V3NOoXVTtTEA4o8BEH8MgBpzc+tlH/be3aUynp5hAFROoyuV9gtKa4a44r1792Zuue+g61+ybqoGBkD8MQDijwFQg+ZumjTdSXPL9XgMgOoIJA1LFXfurdKaRoUPD3Sp+0ujsr+K430HGADxxwCIPwZAjbp506SbvTS1HI/FALCTkdferrRzcBBurfd6eYDCtVmnDc6VNmeV2dgbBGslqakt/eq9R+cic9s5BkD8MQDijwFQo7yXm9866TYv/Ut/H4sBEH1jg97WtWOvH27d8WcMgPhjAMQfXwOsUc7J72gZepmk71q3AADihwFQw3IuF3a0DP2UpLutWwAA8cIAqHE5lyse0LLlPEl3WLcAAOKDARAB57u7Sh0tQ//Je33dugUAEA8MgIjIuVw4ffiizzhpvnULACD6GAAR4pz8tOGLpsm7qVLyrj4HACgfBkAETR+x8BYn9xFJkfneOACgtjAAImra8IX3BE6nSnrFugUAED0MgAib2rLosVKh9C55/cq6BQAQLQyAiJsx9itbOoYPPdM5zbFuAQBEBwMgBnIuV5zWsmiWc/4CSR3WPQCA2scAiJFpLYu/ExZ1hOQftW4BANQ2BkDMfG70oo0dLcNO9V6zJPVa9wAAahMDIIZyLle8csSiOS7w73Fyf7DuAQDUHgZAjE07YPHKHS37TDw0Vfh5Rty9FQDwPxgAMZdzueIzY7509vvSXScfEuT/aN0DAKgNDICE+OnouY+sHnvDficFu2YMdaW8dQ8AwBYDIGEeGTvnpkMLqX2OTPXcP9CVOC8AAAnFAEighw/NdT0xZvb7T0n37HdkqvDzAS5kCABAwjAAEuz+UTe+8sSYL519TpAf+Z50z68HiCEAAEnBAIDuGjNn029Hzz7l3UFpxOFB/v7BLixZNwEAKosBgL94ZOz1rU+NveH9f1ffPPjU1K5bRga9nY6vDwJALDnrANS209fNfP+rPvX5NWH6mB4F/LwYGRv0tq4de/1w644/a8v3sgxjrq3HugCVxhEAvK0lY+b87KmxXzr2jIZg2Cmp7vkHu8JLWcdrPwBEHf9Fhz32ydZr93+5t3fWy2HqI2vC7Dt7+TGqOI4AoNo4AhB/vHKjX07ZkHvHzjD/mS4ffLDNu8O2+nSddVMcMQBQbQyA+GMAoKz+fsPnjtkSBhe9pvQp28LUqNd8UBfyY9ZvDABUGwMg/tLWAYiXn4y66TFJj/35zy9Zf8W+bS77vm1hcFq7D47sVKpliw8Gd3s+UAgAlngRhonTX7zqYB+6/1P0OrwgHdijYL+d3u3T44PGXrl6Kcz0KJXy8kHeO1eUc0n+rAFHAFBtHAGIv+S+ogLoMwZA/DEA4o+vAQIAkEAMAAAAEogBAABAAjEAAABIIAYAAAAJxAAAACCBGAAAACQQAwAAgARiAAAAkEAMAAAAEogBAABAAjEAAABIIAYAAAAJxAAAACCBGAAAACQQAwAAgARiAAAAkEAMAAAAEogBAABAAjEAAABIIAYAAAAJxAAAACCBGAAAACQQAwAAgARiAAAAkEAMAAAAEogBAABAAjEAAABIIAYAAAAJxAAAACCBGAAAACQQAwAAgARiAAAAkEAMAAAAEogBAABAAjEAAABIIAYAAAAJxAAAACCBGAAAACTQ/wNUy3FgVrpPkwAAAABJRU5ErkJggg==
// @downloadURL  https://github.com/wernser412/Reemplazar-texto-coincidente/raw/refs/heads/main/Reemplazar%20texto%20coincidente.user.js
// @match        *://es.onlinemschool.com/*
// @match        *://*.calculatorsoup.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(async function () {
    'use strict';

    const dominio = location.hostname;

    async function obtenerBase() {
        try {
            return JSON.parse(await GM_getValue("reemplazosPorSitio", "{}"));
        } catch {
            return {};
        }
    }

    async function guardarBase(base) {
        await GM_setValue("reemplazosPorSitio", JSON.stringify(base));
    }

    let base = await obtenerBase();
    base[dominio] = base[dominio] || [];
    let reemplazos = base[dominio];

    function aplicarReemplazos(nodo) {
        if (nodo.nodeType !== 3 || !reemplazos.length) return;
        let texto = nodo.nodeValue;
        reemplazos.forEach(([original, nuevo]) => {
            if (original !== undefined && nuevo !== undefined) {
                const regex = new RegExp(`\\b${original}\\b`, 'gi');
                texto = texto.replace(regex, nuevo);
            }
        });
        nodo.nodeValue = texto;
    }

    function recorrerNodos(nodo) {
        if (nodo.nodeType === 3) {
            aplicarReemplazos(nodo);
        } else if (nodo.nodeType === 1 && !['SCRIPT', 'STYLE'].includes(nodo.nodeName)) {
            nodo.childNodes.forEach(recorrerNodos);
        }
    }

    function observarCambios() {
        const observer = new MutationObserver(muts => {
            muts.forEach(m => m.addedNodes.forEach(recorrerNodos));
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    recorrerNodos(document.body);
    observarCambios();

    // === MODAL ===
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        backgroundColor: 'white', border: '1px solid #ccc', padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: '1001', display: 'none',
        width: '500px', height: '400px', resize: 'both', overflow: 'auto'
    });

    const modalHeader = document.createElement('div');
    Object.assign(modalHeader.style, {
        width: '100%', height: '30px', cursor: 'move', background: '#ddd',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold'
    });
    modalHeader.textContent = 'Reemplazos para ' + dominio;
    modal.appendChild(modalHeader);

    let isDragging = false, offsetX, offsetY;
    modalHeader.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - modal.offsetLeft;
        offsetY = e.clientY - modal.offsetTop;
    });
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            requestAnimationFrame(() => {
                modal.style.left = `${e.clientX - offsetX}px`;
                modal.style.top = `${e.clientY - offsetY}px`;
            });
        }
    });
    document.addEventListener('mouseup', () => isDragging = false);

    const textarea = document.createElement('textarea');
    Object.assign(textarea.style, { width: '100%', height: 'calc(100% - 80px)', resize: 'none' });
    textarea.placeholder = 'palabra_original -> palabra_nueva';
    modal.appendChild(textarea);

    const btnGuardar = document.createElement('button');
    btnGuardar.textContent = 'Guardar';
    Object.assign(btnGuardar.style, {
        margin: '10px 5px 0 0', padding: '5px 15px', background: '#28a745', color: 'white',
        border: 'none', borderRadius: '4px', cursor: 'pointer'
    });

    btnGuardar.onclick = async () => {
        const nuevaLista = textarea.value.split('\n')
            .map(l => l.split('->').map(x => x.trim()))
            .filter(p => p.length === 2 && p[0]); // ✅ Solo requiere que la clave no esté vacía

        base = await obtenerBase(); // Recargar base actual
        base[dominio] = nuevaLista;
        await guardarBase(base);
        reemplazos = base[dominio];
        recorrerNodos(document.body);
        modal.style.display = 'none';
    };

    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    Object.assign(btnCancelar.style, {
        margin: '10px 5px 0 0', padding: '5px 15px', background: '#dc3545', color: 'white',
        border: 'none', borderRadius: '4px', cursor: 'pointer'
    });
    btnCancelar.onclick = () => modal.style.display = 'none';

    const btnFlecha = document.createElement('button');
    btnFlecha.textContent = 'Agregar ->';
    Object.assign(btnFlecha.style, {
        margin: '10px 5px 0 0', padding: '5px 15px', background: '#007bff', color: 'white',
        border: 'none', borderRadius: '4px', cursor: 'pointer'
    });
    btnFlecha.onclick = () => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const texto = textarea.value;
        textarea.value = texto.slice(0, start) + ' -> ' + texto.slice(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        textarea.focus();
    };

    modal.appendChild(btnGuardar);
    modal.appendChild(btnCancelar);
    modal.appendChild(btnFlecha);
    document.body.appendChild(modal);

    // === MENÚ DE TAMPERMONKEY ===
    GM_registerMenuCommand("Configurar reemplazos", async () => {
        const datos = await obtenerBase();
        textarea.value = (datos[dominio] || []).map(p => p.join(' -> ')).join('\n');
        modalHeader.textContent = 'Reemplazos para ' + dominio;
        modal.style.display = 'block';
        textarea.focus();
    });

    GM_registerMenuCommand("Exportar reemplazos (todos los sitios)", async () => {
        try {
            const datos = await obtenerBase();
            const pretty = JSON.stringify(datos, null, 2);
            const blob = new Blob([pretty], { type: 'application/json' });
            GM_download({
                url: URL.createObjectURL(blob),
                name: 'reemplazos_global.json',
                saveAs: true
            });
        } catch (e) {
            alert('Error al exportar: ' + e.message);
        }
    });

    GM_registerMenuCommand("Importar reemplazos", () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.addEventListener('change', async () => {
            const file = input.files[0];
            if (!file) return;
            const text = await file.text();
            try {
                const nuevos = JSON.parse(text);
                const actuales = await obtenerBase();
                const fusionados = { ...actuales, ...nuevos };
                await guardarBase(fusionados);
                base = fusionados;
                reemplazos = base[dominio] || [];
                recorrerNodos(document.body);
                alert('Importación completa.');
            } catch (e) {
                alert('Error al importar: ' + e.message);
            }
            input.remove();
        });

        input.click();
    });

})();
