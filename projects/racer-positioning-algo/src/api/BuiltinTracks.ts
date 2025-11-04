import {SerializedTrack} from "./SerializedData";

const BuiltinTracks: SerializedTrack[] = [
    {
        name: "lö triangle",
        points: [
            {
                x: -500,
                y: 0,
                next: [1]
            },
            {
                x: 0,
                y: 500,
                type: "flag",
                next: [2]
            },
            {
                x: 500,
                y: 0,
                next: [0]
            }
        ]
    },
    {
        name: "split diamond",
        points: [
            {
                x: 0,
                y: 0,
                type: "flag",
                next: [1]
            },
            {
                x: -3,
                y: 0,
                next: [2]
            },
            {
                x: -5,
                y: 2,
                next: [3]
            },
            {
                x: -3,
                y: 4,
                next: [4]
            },
            {
                x: -2,
                y: 4,
                next: [5,6]
            },
            {
                x: 0,
                y: 2,
                next: [8]
            },
            {
                x: -1,
                y: 5,
                next: [7]
            },
            {
                x: 1,
                y: 5,
                next: [8]
            },
            {
                x: 2,
                y: 4,
                next: [9]
            },
            {
                x: 3,
                y: 4,
                next: [10]
            },
            {
                x: 5,
                y: 2,
                next: [11]
            },
            {
                x: 3,
                y: 0,
                next: [0]
            }
        ]
    },
    {
        name: "split diamond with hat",
        points: [
            {
                x: 0,
                y: 0,
                type: "flag",
                next: [1]
            },
            {
                x: -3,
                y: 0,
                next: [2]
            },
            {
                x: -5,
                y: 2,
                next: [3]
            },
            {
                x: -3,
                y: 4,
                next: [4]
            },
            {
                x: -2,
                y: 4,
                next: [5,6]
            },
            {
                x: 0,
                y: 2,
                next: [9]
            },
            {
                x: -1,
                y: 5,
                next: [7,8]
            },
            {
                x: 0,
                y: 6,
                next: [8]
            },
            {
                x: 1,
                y: 5,
                next: [9]
            },
            {
                x: 2,
                y: 4,
                next: [10]
            },
            {
                x: 3,
                y: 4,
                next: [11]
            },
            {
                x: 5,
                y: 2,
                next: [12]
            },
            {
                x: 3,
                y: 0,
                next: [0]
            }
        ]
    },
    {
        name: "split diamond with hat and fuck",
        points: [
            {
                x: 0,
                y: 0,
                type: "flag",
                next: [1]
            },
            {
                x: -3,
                y: 0,
                next: [2]
            },
            {
                x: -5,
                y: 2,
                next: [3]
            },
            {
                x: -3,
                y: 4,
                next: [4]
            },
            {
                x: -2,
                y: 4,
                next: [5,7]
            },
            {
                x: 0,
                y: 2,
                next: [6,10]
            },
            {
                x: 1,
                y: 2,
                next: [11]
            },
            {
                x: -1,
                y: 5,
                next: [8,9]
            },
            {
                x: 0,
                y: 6,
                next: [9]
            },
            {
                x: 1,
                y: 5,
                next: [10]
            },
            {
                x: 2,
                y: 4,
                next: [11]
            },
            {
                x: 3,
                y: 4,
                next: [12]
            },
            {
                x: 5,
                y: 2,
                next: [13]
            },
            {
                x: 3,
                y: 0,
                next: [0]
            }
        ]
    },
    {
        name: "parallellogram",
        points: [
            {
                x: 0,
                y: 0,
                next: [1]
            },
            {
                x: 1,
                y: 0,
                next: [2,4]
            },
            {
                x: 2,
                y: 0,
                next: [3,5]
            },
            {
                x: 3,
                y: 0,
                next: [6]
            },
            {
                x: 1.5,
                y: 1,
                next: [5]
            },
            {
                x: 2.5,
                y: 1,
                next: [6]
            },
            {
                x: 3.5,
                y: 1,
                next: [7]
            },
            {
                x: 4.5,
                y: 1
            }
        ]
    },
    {
        name: "squarellogram",
        points: [
            {
                x: 0,
                y: 0,
                next: [1]
            },
            {
                x: 1,
                y: 0,
                next: [2,4]
            },
            {
                x: 2,
                y: 0,
                next: [3,5]
            },
            {
                x: 3,
                y: 0,
                next: [6]
            },
            {
                x: 1,
                y: 1,
                next: [5]
            },
            {
                x: 2,
                y: 1,
                next: [6]
            },
            {
                x: 3,
                y: 1,
                next: [7]
            },
            {
                x: 4,
                y: 1
            }
        ]
    },
    {
        name: "fast bois",
        points: [
            {x: 0, y: 0, next: [1,19,20]},
            {x: 1, y: 10, next: [2]},
            {x: 2, y: -10, next: [3]},
            {x: 3, y: 10, next: [4]},
            {x: 4, y: -10, next: [5]},
            {x: 5, y: 10, next: [6]},
            {x: 6, y: -10, next: [7]},
            {x: 7, y: 10, next: [8]},
            {x: 8, y: -10, next: [9]},
            {x: 9, y: 10, next: [10]},
            {x: 10, y: -10, next: [11]},
            {x: 11, y: 10, next: [12]},
            {x: 12, y: -10, next: [13]},
            {x: 13, y: 10, next: [14]},
            {x: 14, y: -10, next: [15]},
            {x: 15, y: 10, next: [16]},
            {x: 16, y: -10, next: [17]},
            {x: 17, y: 10, next: [18]},
            {x: 18, y: -10, next: [19]},
            {x: 19, y: 10, next: [20]},
            {x: 20, y: -10, next: [21]},
            {x: 21, y: 0, next: [0]},
        ]
    },
    {
        name: "Montreal",
        points: [
            {
                "x": -1321.653,
                "y": -466.388,
                "next": [1]
            },
            {
                "x": -1303.069,
                "y": -620.401,
                "next": [2]
            },
            {
                "x": -1213.468,
                "y": -646.127,
                "next": [3]
            },
            {
                "x": -1231.241,
                "y": -703.499,
                "next": [4]
            },
            {
                "x": -1362.082,
                "y": -689.16,
                "next": [5]
            },
            {
                "x": -1471.287,
                "y": -636.491,
                "next": [6]
            },
            {
                "x": -1458.368,
                "y": -582.163,
                "next": [7]
            },
            {
                "x": -1591.704,
                "y": -513.48,
                "next": [8]
            },
            {
                "x": -1689.173,
                "y": -496.91,
                "next": [9]
            },
            {
                "x": -1725.304,
                "y": -378.796,
                "next": [10]
            },
            {
                "x": -1790.047,
                "y": -367.251,
                "next": [11]
            },
            {
                "x": -1798.933,
                "y": -211.073,
                "next": [12]
            },
            {
                "x": -1758.349,
                "y": -78.437,
                "next": [13]
            },
            {
                "x": -1698.813,
                "y": -90.881,
                "next": [14]
            },
            {
                "x": -1643.574,
                "y": -2.252,
                "next": [15]
            },
            {
                "x": -1672.993,
                "y": 145.799,
                "next": [16]
            },
            {
                "x": -1769.29,
                "y": 267.938,
                "next": [17]
            },
            {
                "x": -1712.801,
                "y": 289.659,
                "next": [18]
            },
            {
                "x": -1674.656,
                "y": 222.056,
                "next": [19]
            },
            {
                "x": -1578.983,
                "y": 154.59,
                "next": [20]
            },
            {
                "x": -1485.32,
                "y": -38.484,
                "next": [21]
            },
            {
                "x": -1428.325,
                "y": -173.56,
                "next": [22,26]
            },
            {
                "x": -1475.714,
                "y": -214.147,
                "next": [23]
            },
            {
                "x": -1358.194,
                "y": -406.857,
                "next": [0,24],
                "type": "flag",
            },

            {
                "x": -1310.252,
                "y": -453.969,
                "next": [25]
            },
            {
                "x": -1258.744,
                "y": -541.438,
                "next": [2]
            },
            {
                "x": -1407.274,
                "y": -256.437,
                "next": [23]
            }
        ]
    }
]
export default BuiltinTracks;