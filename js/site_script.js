$(document).ready(() => {
	// headhesive stuff
	let options = { offset: "#portfolio" };
	// create new headhesive instance
	const header = new Headhesive('.banner-nav-bar', options);

	/* Hamburger menu controller */
	const hamburger = $("#ta-com-hamburger");
	const hamburgerMenu = $("#ta-com-inner-menu");
	const clickNet = $("#ta-com-click-net");

	hamburger.click(() => {
		if (hamburgerMenu.hasClass("closed")) {
			hamburgerMenu.removeClass("closed").addClass("opened")
			clickNet.removeClass("net-disabled");
		} else {
			hamburgerMenu.removeClass("opened").addClass("closed");
			clickNet.addClass("net-disabled");
		}
	});

	// if net catches click, close the hamburger menu
	clickNet.click(() => {
		console.log("a");
		hamburgerMenu.removeClass("opened").addClass("closed");
		clickNet.addClass("net-disabled");
	});

	/* Portfolio drawers controller */
	const drawer1 = $("#portfolio-drawer1");
	const drawer1Btn = $("#portfolio-drawer1 .portfolio-drawer-button");
	const drawer2 = $("#portfolio-drawer2");
	const drawer2Btn = $("#portfolio-drawer2 .portfolio-drawer-button");
	const drawer3 = $("#portfolio-drawer3");
	const drawer3Btn = $("#portfolio-drawer3 .portfolio-drawer-button");

	drawer1Btn.click(() => {
		if (drawer1.hasClass("closed")) {
			drawer1.removeClass("closed").addClass("opened");
		} else {
			drawer1.removeClass("opened").addClass("closed");
		}
	});

	drawer2Btn.click(() => {
		if (drawer2.hasClass("closed")) {
			drawer2.removeClass("closed").addClass("opened");
		} else {
			drawer2.removeClass("opened").addClass("closed");
		}
	});

	drawer3Btn.click(() => {
		if (drawer3.hasClass("closed")) {
			drawer3.removeClass("closed").addClass("opened");
		} else {
			drawer3.removeClass("opened").addClass("closed");
		}
	});
});
