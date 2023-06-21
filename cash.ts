import { XMLParser } from "fast-xml-parser";
import { cashXMLtype } from "./src/handler/cash-handler";

const obj = {
  method: "newmsg",
  myid: "wxid_mno7948yzbk622",
  pid: 6788,
  type: 49,
  data: {
    utype: "3",
    alias: "gaohan085",
    reMark: "",
    nickName: "髙涵_",
    id: "6927602504972275415",
    fromid: "wxid_imkyhaneicft22",
    toid: "wxid_mno7948yzbk622",
    msg: '<?xml version="1.0"?>\n<msg>\n\t<appmsg appid="" sdkver="">\n\t\t<title><![CDATA[微信转账]]></title>\n\t\t<des><![CDATA[收到转账0.10元。如需收钱，请点此升级至最新版本]]></des>\n\t\t<action />\n\t\t<type>2000</type>\n\t\t<content><![CDATA[]]></content>\n\t\t<url><![CDATA[https://support.weixin.qq.com/cgi-bin/mmsupport-bin/readtemplate?t=page/common_page__upgrade&text=text001&btn_text=btn_text_0]]></url>\n\t\t<thumburl><![CDATA[https://support.weixin.qq.com/cgi-bin/mmsupport-bin/readtemplate?t=page/common_page__upgrade&text=text001&btn_text=btn_text_0]]></thumburl>\n\t\t<lowurl />\n\t\t<extinfo />\n\t\t<wcpayinfo>\n\t\t\t<paysubtype>1</paysubtype>\n\t\t\t<feedesc><![CDATA[￥0.10]]></feedesc>\n\t\t\t<transcationid><![CDATA[100005000123062100077148839547046877]]></transcationid>\n\t\t\t<transferid><![CDATA[1000050001202306210213091295916]]></transferid>\n\t\t\t<invalidtime><![CDATA[1687402680]]></invalidtime>\n\t\t\t<begintransfertime><![CDATA[1687316280]]></begintransfertime>\n\t\t\t<effectivedate><![CDATA[1]]></effectivedate>\n\t\t\t<pay_memo><![CDATA[]]></pay_memo>\n\t\t\t<receiver_username><![CDATA[wxid_mno7948yzbk622]]></receiver_username>\n\t\t\t<payer_username><![CDATA[]]></payer_username>\n\t\t</wcpayinfo>\n\t</appmsg>\n</msg>\n',
    data: "",
    source:
      "<msgsource>\n\t<signature>v1_jKENKpy7</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
    des: "髙涵_ : [转账]",
    time: 1687316280,
    type: 49,
  },
};

const parser = new XMLParser({
  numberParseOptions: {
    hex: false,
    leadingZeros: true,
    eNotation: false,
  },
});

const data = parser.parse(obj.data?.msg as string) as cashXMLtype;
console.log(data.msg.appmsg.wcpayinfo.feedesc);
