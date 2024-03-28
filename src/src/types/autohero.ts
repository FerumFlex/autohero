export type Autohero = {
  "version": "0.1.0",
  "name": "autohero",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "newAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "random",
          "type": "u64"
        }
      ]
    },
    {
      "name": "info",
      "accounts": [
        {
          "name": "hero",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeStorage",
      "accounts": [
        {
          "name": "eventsStorage",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addEvent",
      "accounts": [
        {
          "name": "eventsStorage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "message",
          "type": "u128"
        }
      ]
    },
    {
      "name": "applyEvent",
      "accounts": [
        {
          "name": "hero",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventsStorage",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "message",
          "type": "u128"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "eventStorage",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "events",
            "type": {
              "array": [
                {
                  "defined": "Event"
                },
                10
              ]
            }
          },
          {
            "name": "number",
            "type": "u8"
          },
          {
            "name": "total",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "hero",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "random",
            "type": "u64"
          },
          {
            "name": "created",
            "type": "i64"
          },
          {
            "name": "additionalExp",
            "type": "u32"
          },
          {
            "name": "baseAttack",
            "type": "i32"
          },
          {
            "name": "baseDefense",
            "type": "i32"
          },
          {
            "name": "deltaHitpoints",
            "type": "i32"
          },
          {
            "name": "deltaHitpointsUpdate",
            "type": "i64"
          },
          {
            "name": "appliedEvents",
            "type": {
              "array": [
                "u128",
                10
              ]
            }
          },
          {
            "name": "appliedEventsIndex",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Event",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "message",
            "type": "u128"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "EventCannotbeApplied",
      "msg": "Can not apply event"
    },
    {
      "code": 6001,
      "name": "EventIsApplied",
      "msg": "Event is applied"
    }
  ]
};

export const IDL: Autohero = {
  "version": "0.1.0",
  "name": "autohero",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "newAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "random",
          "type": "u64"
        }
      ]
    },
    {
      "name": "info",
      "accounts": [
        {
          "name": "hero",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeStorage",
      "accounts": [
        {
          "name": "eventsStorage",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addEvent",
      "accounts": [
        {
          "name": "eventsStorage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "message",
          "type": "u128"
        }
      ]
    },
    {
      "name": "applyEvent",
      "accounts": [
        {
          "name": "hero",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventsStorage",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "message",
          "type": "u128"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "eventStorage",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "events",
            "type": {
              "array": [
                {
                  "defined": "Event"
                },
                10
              ]
            }
          },
          {
            "name": "number",
            "type": "u8"
          },
          {
            "name": "total",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "hero",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "random",
            "type": "u64"
          },
          {
            "name": "created",
            "type": "i64"
          },
          {
            "name": "additionalExp",
            "type": "u32"
          },
          {
            "name": "baseAttack",
            "type": "i32"
          },
          {
            "name": "baseDefense",
            "type": "i32"
          },
          {
            "name": "deltaHitpoints",
            "type": "i32"
          },
          {
            "name": "deltaHitpointsUpdate",
            "type": "i64"
          },
          {
            "name": "appliedEvents",
            "type": {
              "array": [
                "u128",
                10
              ]
            }
          },
          {
            "name": "appliedEventsIndex",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Event",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "message",
            "type": "u128"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "EventCannotbeApplied",
      "msg": "Can not apply event"
    },
    {
      "code": 6001,
      "name": "EventIsApplied",
      "msg": "Event is applied"
    }
  ]
};
