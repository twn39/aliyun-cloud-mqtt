import { h, Component } from 'preact';
import hex_hmac_md5 from "../plugins/hex_md5";
import hex_hmac_sha1 from "../plugins/hex_hmac_sha1";

export default class App extends Component {

	constructor(props) {
		super(props);
		this.onSign = this.onSign.bind(this);
		this.state = {
			productKey: '',
			deviceName: '',
			deviceSecret: '',
			timestamp: '',
			clientId: '',
			method: 'hmacsha1',
			password: '',
			region: 'cn-shanghai',
		};
	}

	onSign() {
		console.log(this.state);
		let pk = this.state.productKey.trim();
		let dn = this.state.deviceName.trim();
		let ds = this.state.deviceSecret.trim();
		let ts = this.state.timestamp.trim();
		let ci = this.state.clientId.trim();
		let sm = this.state.method;
		if (pk === "" || dn === "" || ds === "" || ci === "") {
			alert("ProductKey,DeviceName,DeviceSecret,ClientId 不能为空！");
			return;
		}
		let options = {
			productKey: pk,
			deviceName: dn,
			clientId: ci
		}
		if ( ts !== "") {
			options = {
			    ...options,
				timestamp: ts,
			}
		}
		let keys = Object.keys(options).sort();
		// 按字典序排序
		keys = keys.sort();
		let list = [];
		keys.forEach(function(key) {
			list.push(key + options[key]);
		});
		let contentStr = list.join('');
		let sign="";
		if (sm === "hmacmd5") {
			sign = hex_hmac_md5(ds, contentStr);
		} else if (sm === "hmacsha1") {
			sign = hex_hmac_sha1(ds, contentStr);
		} else {
			alert("method is invalid");
		}
		this.setState({
			password: sign.toUpperCase()
		})
	}

	render() {

		return (
			<div id="app">
				<header className="header">
					<div className="container">
                        <h2>阿里云物联网平台 MQTT 密码生成工具</h2>
						<h3>填入设备信息：</h3>
					</div>
				</header>
				<div className="container">
                    <div className="form">

						<div className="field">
							<label htmlFor="">Product Key: </label>

							<input type="text"
								   value={this.state.productKey}
								   onInput={e => this.setState({productKey: e.target.value}) } />
						</div>
						<div className="field">
							<label htmlFor="">Device Name: </label>
							<input type="text"
								   onInput={e => this.setState({deviceName: e.target.value})} />
						</div>

						<div className="field">
							<label htmlFor="">Device Secret: </label>
							<input type="text"
								   onInput={e => this.setState({deviceSecret: e.target.value})}
							/>
						</div>
                        <div className="field">
							<label htmlFor="">Timestamp: </label>
							<input type="text"
								   onInput={e => this.setState({timestamp: e.target.value})} />
								   <span>（可选）</span>
						</div>
                        <div className="field">
							<label htmlFor="">Client ID: </label>
							<input type="text"
								   onInput={e => this.setState({clientId: e.target.value})}
							/>
							<span className="tips">* 可取任意值,建议使用设备的MAC地址或SN码</span>
						</div>

						<div className="field">
							<label htmlFor="">Method: </label>
							<select id="signMethod" name="signMethod" onChange={e => this.setState({method: e.target.value})}>
								<option value="hmacmd5">Hmac-md5</option>
								<option value="hmacsha1" selected>Hmac-sha1</option>
							</select>
						</div>
						<div className="field">
							<label htmlFor="">Region: </label>
							<select name="" id="" onChange={e => this.setState({region: e.target.value})}>
								<option selected value="cn-shanghai">上海</option>
								<option value="cn-beijing">北京</option>
								<option value="cn-hangzhou">杭州</option>
								<option value="cn-shenzhen">深圳</option>
								<option value="cn-chengdu">成都</option>
								<option value="cn-hongkong">香港</option>
								<option value="ap-northeast-1">东京</option>
								<option value="eu-west-1">伦敦</option>
							</select>
						</div>
                        <div className="field">
							<button className="sign-btn" onClick={this.onSign}>生成</button>
						</div>
						<div className="result">
							<span>签名结果：</span>
                            <p>
								MQTT Client ID : {`${this.state.clientId}|securemode=3,signmethod=${this.state.method}|`}
							</p>
                            <p>User Name : <code>{this.state.deviceName + '&' + this.state.productKey}</code></p>
							<p>
								Password : <code>{this.state.password || 'null'}</code>
							</p>
							<p>
								Broker Address : <code>{`${this.state.productKey}.iot-as-mqtt.${this.state.region}.aliyuncs.com`}</code>
							</p>
							<p>Broker Port : <code>1883</code></p>
						</div>

					</div>

				</div>

				<footer>

				</footer>
			</div>
		);
	}
}
