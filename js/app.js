const container = document.querySelector('.container');
const homeButton = document.querySelector('.home-button');
const searchInput = document.querySelector('.search__input');
const coinTable = document.querySelector('.table__coins');
const coinTBody = document.querySelector('.tbody__coins');
const coinContainer = document.querySelector('.coin__page--container');
const titleDiv = document.querySelector('.title');

const display100Coins = async area => {
	const response = await axios.get(
		'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
	);

	const data = response.data;

	coinTable.classList.remove('searched-table');

	const title = document.createElement('h2');
	title.innerHTML = `<h2 class="display-title">Today's Crypto Currencies by Market Cap</h2>`;
	titleDiv.appendChild(title);

	const coinTableHead = document.createElement('thead');
	coinTableHead.innerHTML = `
	<thead>
		<tr>
			<td>#</td>
			<td>Name</td>
			<td class="table__coin--price">Price</td>
			<td>24h %</td>
			<td>Market Cap</td>
			<td>Volume &#40;24h&#41;</td>
			<td>Circulating Supply</td>
		</tr>
	</thead>`;
	area.appendChild(coinTableHead);

	for (let i = 0; i < data.length; i++) {
		let color;
		data[i].price_change_percentage_24h < 0 ? (color = 'red') : (color = 'green');

		const coinTableRow = document.createElement('tr');

		coinTableRow.innerHTML = `
		<tr>
			<td>${i + 1}</td>
			<td><a href="#"><img src="${data[i].image}"><span class="table__coin--name">${data[i]
			.name}</span> <span class="table__coin--symbol">${data[i].symbol.toUpperCase()}</span></a></td>
			<td class="table__coin--price">$${data[i].current_price > 10000
				? data[i].current_price.toLocaleString()
				: data[i].current_price}</td>
			<td class="${color}">${data[i].price_change_percentage_24h.toLocaleString()}%</td>
			<td>$${data[i].market_cap.toLocaleString()}</td>
			<td>$${data[i].total_volume.toLocaleString()}</td>
			<td>${data[i].circulating_supply.toLocaleString()}</td>
		</tr>`;
		coinTableRow.classList.add('border-bottom', 'border-top');
		area.appendChild(coinTableRow);

		coinTableRow.addEventListener('click', async () => {
			const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${data[i].id}`);

			let backgroundColor;
			data[i].price_change_percentage_24h < 0
				? (backgroundColor = 'red-background')
				: (backgroundColor = 'green-background');

			let color;
			data[i].price_change_percentage_24h < 0 ? (color = 'red') : (color = 'green');

			let athColor;
			res.data.market_data.ath_change_percentage.usd < 0 ? (athColor = 'red') : (athColor = 'green');

			const coinDiv = document.createElement('div');
			coinDiv.innerHTML = `
			<div class="coin__page">
				<div class="coin__page--top">
					<div>
						<div class="coin__page--info">
								<img src="${res.data.image.small}">
								<h2>${res.data.name}</h2>
								<span class="table__coin--symbol">${data[i].symbol.toUpperCase()}</span>
						</div>
						<div class="coin__page--about">
							<div class="dark-background coin__page--rank"><p>Rank #${data[i].market_cap_rank}</p></div>
							<div class="light-background coin__page--category"><p>${res.data.categories[0]}</p></div>
						</div>
					</div>
					<div class="coin__page--stats">
						<p>${data[i].name} Price (${data[i].symbol.toUpperCase()})</p>
						<div class="coin__page--price">
							<h3>$${data[i].current_price > 10000 ? data[i].current_price.toLocaleString() : data[i].current_price}</h3>
							<div class="${backgroundColor}">${data[i].price_change_percentage_24h.toLocaleString()}%</div>
						</div>
					</div>
				</div>
				<div class="coin__page--middle">
					<div class="coin__page--middle-title"><h2>Market Data</h2></div>
					<div class="coin__page--middle-container">
						<div class="coin__page--market-cap">
							<h2>Market Cap</h2>
							<h3>$${data[i].market_cap.toLocaleString()}</h3>
							<p class="${color}">${data[i].market_cap_change_percentage_24h.toLocaleString()}%</p>
						</div>
						<div class="coin__page--volume">
							<h2>Volume (24h)</h2>
							<h3>$${data[i].total_volume.toLocaleString()}</h3>
						</div>
						<div class="coin__page--supply">
							<h2>Circulating Supply</h2>
							<h3>${data[i].circulating_supply}</h3>
						</div>
						<div class="coin__page--ath">
							<h2>ATH</h2>
							<h3>$${data[i].ath.toLocaleString()}</h3>
							<p class="${athColor}">${res.data.market_data.ath_change_percentage.usd.toLocaleString()}%</p>
						</div>
					</div>
				</div>
				<div class="coin__page--bottom">
					<div class="coin__page--description">
						<h2>Coin Description</h2>
						<p>${res.data.description.en ? res.data.description.en : 'Coin does not have a description yet.'}</p>
					</div>
				</div>
			</div>
			`;
			titleDiv.innerHTML = '';
			coinTable.innerHTML = '';
			coinContainer.appendChild(coinDiv);
		});
	}
};

const fetchSearchData = async (search, area) => {
	const response = await axios.get(
		'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false'
	);

	if (search) {
		let searchResults = [];
		for (let i = 0; i < response.data.length; i++) {
			if (
				response.data[i].id.toLowerCase().includes(search.toLowerCase()) ||
				response.data[i].symbol.toLowerCase().includes(search.toLowerCase())
			) {
				searchResults.push(response.data[i]);
			}
		}

		const searchTableHead = document.createElement('thead');
		searchTableHead.innerHTML = `
		<thead>
			<tr>
				<td>Name</td>
				<td class="table__coin--price">Price</td>
				<td>24h %</td>
				<td>Market Cap</td>
				<td>Volume &#40;24h&#41;</td>
				<td>Circulating Supply</td>
			</tr>
		</thead>`;
		area.appendChild(searchTableHead);

		for (let i = 0; i < searchResults.length; i++) {
			let color;
			searchResults[i].price_change_percentage_24h < 0 ? (color = 'red') : (color = 'green');
			const searchTableRow = document.createElement('tr');

			searchTableRow.innerHTML = `
			<tr>
				<td><a href="#"><img src="${searchResults[i].image}"><span class="table__coin--name">${searchResults[i]
				.name}</span> <span class="table__coin--symbol">${searchResults[i].symbol.toUpperCase()}</span></a></td>
				<td class="table__coin--price">$${searchResults[i].current_price > 10000
					? searchResults[i].current_price.toLocaleString()
					: searchResults[i].current_price}</td>
				<td class="${color}">${searchResults[i].price_change_percentage_24h.toLocaleString()}%</td>
				<td>$${searchResults[i].market_cap.toLocaleString()}</td>
				<td>$${searchResults[i].total_volume.toLocaleString()}</td>
				<td>${searchResults[i].circulating_supply.toLocaleString()}</td>
			</tr>`;
			searchTableRow.classList.add('border-bottom', 'border-top');
			area.appendChild(searchTableRow);

			searchTableRow.addEventListener('click', async () => {
				const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${searchResults[i].id}`);

				searchInput.value = '';

				let backgroundColor;
				searchResults[i].price_change_percentage_24h < 0
					? (backgroundColor = 'red-background')
					: (backgroundColor = 'green-background');

				let color;
				searchResults[i].price_change_percentage_24h < 0 ? (color = 'red') : (color = 'green');

				let athColor;
				res.data.market_data.ath_change_percentage.usd < 0 ? (athColor = 'red') : (athColor = 'green');

				const coinDiv = document.createElement('div');
				coinDiv.innerHTML = `
				<div class="coin__page">
					<div class="coin__page--top">
						<div>
							<div class="coin__page--info">
									<img src="${res.data.image.small}">
									<h2>${res.data.name}</h2>
									<span class="table__coin--symbol">${searchResults[i].symbol.toUpperCase()}</span>
							</div>
							<div class="coin__page--about">
								<div class="dark-background coin__page--rank"><p>Rank #${searchResults[i].market_cap_rank}</p></div>
								<div class="light-background coin__page--category"><p>${res.data.categories[0]}</p></div>
							</div>
						</div>
						<div class="coin__page--stats">
							<p>${searchResults[i].name} Price (${searchResults[i].symbol.toUpperCase()})</p>
							<div class="coin__page--price">
								<h3>$${searchResults[i].current_price > 10000
									? searchResults[i].current_price.toLocaleString()
									: searchResults[i].current_price}</h3>
								<div class="${backgroundColor}">${searchResults[i].price_change_percentage_24h.toLocaleString()}%</div>
							</div>
						</div>
					</div>
					<div class="coin__page--middle">
						<div class="coin__page--middle-title"><h2>Market Data</h2></div>
						<div class="coin__page--middle-container">
							<div class="coin__page--market-cap">
								<h2>Market Cap</h2>
								<h3>$${searchResults[i].market_cap.toLocaleString()}</h3>
								<p class="${color}">${searchResults[i].market_cap_change_percentage_24h.toLocaleString()}%</p>
							</div>
							<div class="coin__page--volume">
								<h2>Volume (24h)</h2>
								<h3>$${searchResults[i].total_volume.toLocaleString()}</h3>
							</div>
							<div class="coin__page--supply">
								<h2>Circulating Supply</h2>
								<h3>${searchResults[i].circulating_supply}</h3>
							</div>
							<div class="coin__page--ath">
								<h2>ATH</h2>
								<h3>$${searchResults[i].ath.toLocaleString()}</h3>
								<p class="${athColor}">${res.data.market_data.ath_change_percentage.usd.toLocaleString()}%</p>
							</div>
						</div>
					</div>
					<div class="coin__page--bottom">
						<div class="coin__page--description">
							<h2>Coin Description</h2>
							<p>${res.data.description.en}</p>
						</div>
					</div>
				</div>
				`;
				coinTable.innerHTML = '';
				coinContainer.appendChild(coinDiv);

				console.log(res.data);
				console.log(searchResults[i]);
			});
		}
	}
};

const onInput = e => {
	titleDiv.innerHTML = '';
	coinTable.innerHTML = '';
	coinContainer.innerHTML = '';
	coinTable.classList.add('searched-table');
	fetchSearchData(e.target.value, coinTable);
	if (e.target.value === '') {
		display100Coins(coinTable);
	}
};

homeButton.addEventListener('click', () => {
	titleDiv.innerHTML = '';
	coinTable.innerHTML = '';
	if (coinContainer.innerHTML !== '') {
		coinContainer.innerHTML = '';
		if (searchInput.value !== '') {
			searchInput.value = '';
		}
	}
	if (searchInput.value !== '') {
		searchInput.value = '';
	}
	display100Coins(coinTable);
});

display100Coins(coinTable);

searchInput.addEventListener('input', debounce(onInput, 300));
