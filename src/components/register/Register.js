import React, { useState } from 'react';

function Register({ onRouteChange, loadUser }) {
// const Register = ({ onRouteChange }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onNameChange = (event) => {
		setName(event.target.value);
	}

	const onEmailChange = (event) => {
		setEmail(event.target.value);
	}

	const onPasswordChange = (event) => {
		setPassword(event.target.value);
	}

	const onSubmitRegister = () => {
		// console.log(name, email, password);
		fetch('https://nameless-castle-69800.herokuapp.com/register', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: name,
				email: email,
				password: password
			})
		})
		.then(response => response.json())
		.then(user => {
			if (user.id) {
				loadUser(user);
				onRouteChange('home');
			}
			// console.log(user);
		})
	}

	return (
		<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
			<main className="pa4 black-80">
				<div className="measure">
					<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
						<legend className="f1 fw6 ph0 mh0">Registrarse</legend>
						<div className="mt3">
							<label className="db fw6 lh-copy f6" htmlFor="name">Nombre</label>
							<input 
								className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
								type="text" 
								name="name" 
								id="name" 
								onChange={onNameChange}
							/>
						</div>
						<div className="mt3">
							<label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
							<input 
								className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
								type="email" 
								name="email-address" 
								id="email-address" 
								onChange={onEmailChange}
							/>
						</div>
						<div className="mv3">
							<label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
							<input 
								className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
								type="password" 
								name="password" 
								id="password" 
								onChange={onPasswordChange}
							/>
						</div>
					</fieldset>
					<div className="">
						<input 
							onClick={onSubmitRegister}
							className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
							type="submit" 
							value="Registrar" 
						/>
					</div>
				</div>
			</main>
		</article>
	)
}

export default Register;