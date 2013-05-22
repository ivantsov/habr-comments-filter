// ==UserScript==
// @name habrCommentsFilter
// @description filter comments by rating
// @author Alexander Ivantsov
// @license MIT
// @version 1.1
// @include http://habrahabr.ru/post/*
// @include http://habrahabr.ru/company/*/blog/*
// ==/UserScript==

var inp = "<p style='color: #fff'>Мин рейтинг: <input id='min-comment-rating' style='width: 30px' type='text' value='0' /></p>";
var btn = "<button id='filter-comments' style='margin-top: 10px'>Отфильтровать камменты</button>";
var div = "<div class='comments_control' style='opacity: 0.5; position: fixed; top: 50px; right: 0; background-color: #2e2e2e; padding: 10px 30px 10px 10px'><div style='position: relative'>" + inp + btn + "<a id='hidePanel' href='javascript:void(0)' style='color: #fff; position: absolute; right: -25px; top: -5px; text-decoration: none; font-size: 20px; font-weight: bold; text-shadow: 0 1px 0 #FFFFFF'>×</a></div></div>";

$ ( "body" ).append ( div );

function filterComments ()
{
	var minRating = parseInt ( $ ( "#min-comment-rating" ).val (), 10 )
		, rating, len, i, $comment_score_el
		, scores = $( document.getElementById ( 'comments' ) ).find ( ".mark .score" )
		;

	/* выставляем класс 'cool_comment' для каментов с нужным рейтингом */
	for ( i = 0, len = scores.length ; i < len ; ++i )
	{
		$comment_score_el	= scores.eq ( i );

		rating = parseInt ( $comment_score_el.html (), 10 );

		if ( isNaN ( rating ) )
		{
			rating = 0;
//			-1 * parseInt ( $ ( this ).find ( ".mark .score" ).html ().replace ( "–", "" ), 10 );
		}

		if ( rating >= minRating )
		{
			$comment_score_el .parents ( '.comment_item' ).addClass ( "cool_comment" );
		}
	}

	$( '.comment_item:not(.cool_comment)' ).hide ();
}

function refreshComments ()
{
	$( document.getElementById ( 'comments' ) ).find( '.comment_item:not(.cool_comment)' ).show ();
	$( document.getElementById ( 'comments' ) ).find( '.cool_comment' )
}

var toggleBtn = 0; // 0 - включить фильтр, 1 - сбросить фильтр

$ ( "#filter-comments" ).click ( function ()
{
	/* запуск фильтра */
	if ( !toggleBtn )
	{
		$ ( "#filter-comments" ).css ( "margin-top", 0 );
		filterComments ();
		toggleBtn = 1;
		$ ( "#min-comment-rating" ).parent ().slideUp ();
		$ ( this ).html ( "Сбросить фильтр" );
	}
	/* сбросить фильтр */
	else
	{
		$ ( "#filter-comments" ).css ( "margin-top", "10px" );
		refreshComments ();
		toggleBtn = 0;
		$ ( "#min-comment-rating" ).parent ().slideDown ();
		$ ( this ).html ( "Отфильтровать камменты" );
	}
	;
} );

var togglePanel = 0; // 0 - открыто, 1 - свернуто

/* скрыть панель */
$ ( "#hidePanel" ).click ( function ( event )
{
	event.stopPropagation ();

	togglePanel = 1;
	$ ( ".comments_control" ).animate ( {
		right      : -$ ( ".comments_control" ).width () - 30,
		paddingLeft: "+=20"
	}, 1000 );
} );

/* открыть панель */
$ ( ".comments_control" ).click ( function ()
{
	if ( togglePanel == 0 ) return 0;
	togglePanel = 0;
	$ ( this ).animate ( {
		paddingLeft: "-=20",
		right      : 0
	}, 1000 );
} );

/* управление прозрачностью панели */
$ ( ".comments_control" ).hover ( function ()
{
	$ ( this ).css ( "opacity", 1 );
}, function ()
{
	$ ( this ).css ( "opacity", 0.5 );
} );

/* показать скрытые ответы */

$ ( ".show_reply" ).live ( "click", function ()
{
	var parent;

	/* если ответы скрыты */
	if ( $ ( this ).html () == "Показать ответы" )
	{
		$ ( this ).html ( "Скрыть ответы" );

		parent = $ ( this ).closest ( ".comment_item" );

		parent.find ( ".comment_item" ).each ( function ()
		{
			$ ( this ).show ();
		} );
	}
	/* если ответы открыты */
	else
	{
		$ ( this ).html ( "Показать ответы" );

		parent = $ ( this ).closest ( ".comment_item" );

		parent.find ( ".comment_item" ).each ( function ()
		{
			if ( !$ ( this ).hasClass ( "cool_comment" ) && $ ( this ).find ( ".cool_comment" ).length == 0 ) $ ( this ).hide ();
		} );
	}
} );
