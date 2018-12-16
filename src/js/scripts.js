window.ready = function(fn)
{
	if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

window.sliderconfig = {
	categories: {
		'Joomla!': [
			'5 Gründe, warum Joomla! 4 fantastisch wird.',
			'Ich habe gestern all meine Seiten auf Joomla! 4 migriert',
			'Ich habe Joomla! 4 getestet',
			'Geld verdienen mit Joomla! ist einfach.',
			'Meine Lieblingserweiterung für Joomla!',
			'Joomla! lernen in nur 10 Jahren.'

		],
		'Community': [
			'Ich halte in Wien einen Vortrag',
			'Joomla! ist meine Familie',
			'#JBeer',
			'JCamping hat mein Leben verändert',
			'JUG München rocks'

		],
		'FML': [
			'Ich brauche keine Backups!',
			'Das letzte Update hat meine Seite zerstört',
			'Mist, ich habe mein Passwort vergessen',
			'Lost in Translation',
			'Internet kaputt? Jaaaa, ich war das...',
			'Es gibt ein Leben neben Joomla!, sagt man...'
		],
		'Weihnachten & Neujahr': [
			'Advent, Advent der Christbaum brennt',
			'Dieses Jahr trinke ich nur ein Glas Glühwein, versprochen',
			'Weihnachten wäre noch besser wenn nicht überall Rosinen drin wären',
			'Nächstes Jahr wird alles anders.',

		]
	}
};

window.ready(function()
{
	var duration = document.getElementById('karaoke-duration'),
		durationLabel = document.getElementById('karaoke-duration-label'),
		steps = (duration.max - duration.min) / duration.step + 1,
		categoryselect = document.getElementById('karaoke-category'),
		selectbutton = document.getElementById('karaoke-select-button'),
		reselectbutton = document.getElementById('karaoke-reselect-button'),
		playbutton = document.getElementById('karaoke-play-button'),
		topic = document.getElementById('karaoke-topic'),
		imagesholder = document.getElementById('karaoke-images'),
		images = [];

	var loadImage = function(i)
	{
		var file = 'images/' + ((i + "").padStart(3, '0')) + '-slide.jpg';

		var img = new Image();

		img.onload = function()
		{
			images.push(file);

			loadImage(i + 1);
		};

		img.src = file;

		var file2 = 'images/' + ((i + "").padStart(3, '0')) + '-slide.png';

		var img2 = new Image();

		img2.onload = function()
		{
			images.push(file2);

			loadImage(i + 1);
		};

		img2.src = file2;
	}

	loadImage(1);

	var event = new Event('rangeChanged');

	duration.addEventListener('rangeChanged', function()
	{
		durationLabel.innerHTML = this.value + 'm';

		var labelPosition = (this.value - this.min) / (this.max - this.min);

		if (this.value - this.min > (this.max - this.min) / 2)
		{
			labelPosition -= (1 / steps / steps) * labelPosition;
		}
		else
		{
			labelPosition += (1 / steps / steps) * labelPosition;
		}

		durationLabel.style.left = (labelPosition * 100) + "%";
	});

	duration.addEventListener('input', function()
	{
		this.dispatchEvent(event);
	})

	durationLabel.style.marginLeft = (durationLabel.offsetWidth / -2 + 5) + 'px';
	duration.dispatchEvent(event);

	// Category Select
	var category = document.getElementById('karaoke-category');

	for (var i in window.sliderconfig.categories)
	{
		category.innerHTML += '<option value="' + i + '">' + i + '</option>';
	}

	// Second step
	var selecttopic = function()
	{
		if (window.sliderconfig.categories[categoryselect.value].length)
		{
			var cats = window.sliderconfig.categories[categoryselect.value],
				title = cats[Math.floor(Math.random() * cats.length)];

			document.getElementById('karaoke-intro').style.display = 'none';
			document.getElementById('karaoke-ready').style.display = 'grid';
			document.getElementById('karaoke-play').style.display = 'none';

			topic.innerHTML = title;
		}
	};

	selectbutton.addEventListener('click', selecttopic);

	reselectbutton.addEventListener('click', selecttopic);

	// Thirs step
	var startPresentation = function()
	{
		var count = 3;

		var startSlideShow = function()
		{
			var slides = [],
				secperpage = 10,
				slideduration = secperpage * 1000,
				timeout;

			for (var i = 0; i < duration.value * (60 / secperpage); ++i)
			{
				var image = images[Math.floor(Math.random() * images.length)];

				while (slides.includes(image))
				{
					image = images[Math.floor(Math.random() * images.length)];
				}

				slides.push(image);
			}

			var showSlide = function()
			{
				imagesholder.innerHTML = '<div id="karaoke-progress"><div id="karaoke-progress-bar"></div></div>';

				var image = slides.pop();

				imagesholder.style.backgroundImage = "url('" + image + "')";

				var progressbar = document.getElementById('karaoke-progress-bar');

				var i = 0;

				if (timeout)
				{
					clearTimeout(timeout);
				}

				var tickBar = function()
				{
					var width = 7000 / slideduration * i;

					progressbar.style.width = Math.min(100, Math.max(width, 0)) + '%';

					++i;

					if (width < 100)
					{
						timeout = setTimeout(tickBar, 50);
					}
				}

				tickBar();

				if (slides.length)
				{
					setTimeout(showSlide, slideduration);
				}
				else
				{
					setTimeout(function()
					{
						document.getElementById('karaoke-play').style.display = 'none';
						document.getElementById('karaoke-end').style.display = 'grid';


					}, slideduration);

					setTimeout(function()
					{
						document.getElementById('karaoke-intro').style.display = 'grid';
						document.getElementById('karaoke-end').style.display = 'none';


					}, slideduration + 5000);

				}
			}

			showSlide();
		}

		var countCounter = function()
		{
			imagesholder.innerHTML = '<div>' + count + '</div>';

			if (count > 1)
			{
				-- count;

				setTimeout(countCounter, 1000);
			}
			else
			{
				setTimeout(startSlideShow, 1000);
			}
		}

		countCounter();

		imagesholder.style.backgroundImage = 'none';

		document.getElementById('karaoke-ready').style.display = 'none';
		document.getElementById('karaoke-play').style.display = 'grid';
	}

	playbutton.addEventListener('click', startPresentation);
})