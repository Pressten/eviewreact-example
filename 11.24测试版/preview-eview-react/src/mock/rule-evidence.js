// Original HCS1 demo findings and rule guidance, keyed by rule and device ID.
export const ruleEvidence = {
  "mgmt": {
    "description": "设备管理 IP 地址必须与该设备的规划地址一致。",
    "suggestion": "核对变更审批，恢复规划IP或更新规划台账。",
    "findings": {
      "d1": [
        {
          "line": 44,
          "context": "interface MEth0/0/0",
          "excerpt": "ip address 10.10.1.11 255.255.255.0"
        }
      ],
      "d5": [
        {
          "line": 44,
          "context": "interface MEth0/0/0",
          "excerpt": "ip address 10.10.1.15 255.255.255.0"
        }
      ]
    }
  },
  "addr2": {
    "suggestion": "核对业务接口地址规划与变更记录，再调整配置。",
    "findings": {
      "d3": [
        {
          "line": 63,
          "context": "interface Vlanif100",
          "excerpt": "ip address 172.16.101.1 255.255.255.0"
        }
      ]
    }
  },
  "ntp2": {
    "description": "NTP 时钟源地址必须与规划的时钟源地址一致。",
    "suggestion": "将主时钟源恢复为规划地址，保留备用源。",
    "findings": {
      "d1": [
        {
          "line": 30,
          "context": "",
          "excerpt": "ntp-service unicast-server 10.10.0.99"
        }
      ],
      "d4": [
        {
          "line": 30,
          "context": "",
          "excerpt": "ntp-service unicast-server 10.10.0.99"
        }
      ]
    }
  },
  "ntp3": {
    "suggestion": "将备用时钟源恢复为规划地址。",
    "findings": {
      "d2": [
        {
          "line": 31,
          "context": "",
          "excerpt": "ntp-service unicast-server 10.10.0.99"
        }
      ],
      "d5": [
        {
          "line": 31,
          "context": "",
          "excerpt": "ntp-service unicast-server 10.10.0.99"
        }
      ]
    }
  },
  "ssh": {
    "suggestion": "替换为 CTR + SHA2 套件，在维护窗口执行并保留回退命令。",
    "findings": {
      "d1": [
        {
          "line": 3,
          "context": "",
          "excerpt": "ssh server cipher aes128_cbc 3des_cbc"
        },
        {
          "line": 108,
          "context": "",
          "excerpt": "ssh server hmac md5 sha1"
        }
      ],
      "d2": [
        {
          "line": 3,
          "context": "",
          "excerpt": "ssh server cipher aes128_cbc"
        }
      ],
      "d3": [
        {
          "line": 3,
          "context": "",
          "excerpt": "ssh server cipher aes128_cbc"
        }
      ]
    }
  },
  "sec3": {
    "suggestion": "启用账户密码复杂度校验，并核验存量账户策略。",
    "findings": {
      "d2": [
        {
          "line": 90,
          "context": "aaa / local-aaa-user password policy administrator",
          "excerpt": "password complexity disable"
        }
      ]
    }
  },
  "timeout": {
    "description": "适用用户接口的空闲超时时间不得超过10分钟（600秒）。",
    "suggestion": "将超限位置的空闲超时调整至10分钟以内。",
    "findings": {
      "d1": [
        {
          "line": 122,
          "context": "user-interface vty 0 4",
          "excerpt": "idle-timeout 15 0"
        },
        {
          "line": 132,
          "context": "user-interface console 0",
          "excerpt": "idle-timeout 10 30"
        }
      ],
      "d2": [
        {
          "line": 122,
          "context": "user-interface vty 0 4",
          "excerpt": "idle-timeout 15 0"
        },
        {
          "line": 132,
          "context": "user-interface console 0",
          "excerpt": "idle-timeout 10 30"
        }
      ],
      "d4": [
        {
          "line": 122,
          "context": "user-interface vty 0 4",
          "excerpt": "idle-timeout 15 0"
        },
        {
          "line": 132,
          "context": "user-interface console 0",
          "excerpt": "idle-timeout 10 30"
        }
      ]
    }
  },
  "sec5": {
    "suggestion": "将管理登录认证方式恢复为 AAA，并确认认证链路可用。",
    "findings": {
      "d3": [
        {
          "line": 121,
          "context": "user-interface vty 0 4",
          "excerpt": "authentication-mode password"
        }
      ]
    }
  },
  "vlan3": {
    "description": "Trunk 接口仅允许放通规划范围内的 VLAN。",
    "suggestion": "核验业务依赖后，移除未纳入规划的 VLAN。",
    "findings": {
      "d4": [
        {
          "line": 73,
          "context": "interface 100GE1/0/1",
          "excerpt": "port trunk allow-pass vlan 100 200 300"
        }
      ]
    }
  }
};
