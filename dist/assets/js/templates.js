angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("app/gameDetail/gameDetail.html","<div class=row><div class=col-md-6><img ng-src=\"{{ actualGame.image }}\" width=300px style=\"display: inline-block; vertical-align: top\"><div style=\"display: inline-block; margin-left: 50px\"><p class=h2>{{ actualGame.name }}</p><p class=h4><span class=\"label label-primary\">{{ actualGame.genre }}</span></p><p class=h3>Preis: <span class=price>{{ actualGame.price }} € *</span><br><span class=h5 style=\"vertical-align: top\">*inklusive MwSt.</span></p><p class=h4 style=\"font-size: 16px\">Keine Versandkosten für alle Produkte!</p><p class=h4 style=\"color: #04B404; font-weight: bold;\">Auf Lager</p><p class=h5>Verfügbar auf folgenden Plattformen:<br><img ng-repeat=\"image in actualGame.platforms\" ng-src=assets/img/{{image}}.png class=platform style=margin-top:10px></p><p>Altersfreigabe: <b>FSK {{ actualGame.fsk }}</b></p><p>Durchschnittliche Bewertung: <span class=stars uib-tooltip=Bewerten><span class=rating><span class=star-active ng-class=\"{\'star-selected\': starsActivator[1]}\" ng-mouseover=starHover(1) ng-mouseleave=leave() ng-click=rate(1)>★</span><span ng-class=\"{\'star-inactive\': stars < 1.5, \'star-active\': stars >= 1.5, \'star-selected\': starsActivator[2] }\" ng-mouseover=starHover(2) ng-mouseleave=leave() ng-click=rate(2)>★</span><span ng-class=\"{\'star-inactive\': stars < 2.5, \'star-active\': stars >= 2.5, \'star-selected\': starsActivator[3] }\" ng-mouseover=starHover(3) ng-mouseleave=leave() ng-click=rate(3)>★</span><span ng-class=\"{\'star-inactive\': stars < 3.5, \'star-active\': stars >= 3.5, \'star-selected\': starsActivator[4] }\" ng-mouseover=starHover(4) ng-mouseleave=leave() ng-click=rate(4)>★</span><span ng-class=\"{\'star-inactive\': stars < 4.5, \'star-active\': stars >= 4.5, \'star-selected\': starsActivator[5] }\" ng-mouseover=starHover(5) ng-mouseleave=leave() ng-click=rate(5)>★</span></span> <span class=rating-outline><span class=star-active ng-class=\"{\'star-selected\': starsActivator[1]}\" ng-mouseover=starHover(1) ng-mouseleave=leave()>☆</span><span ng-class=\"{\'star-active\': stars >= 1.5, \'star-selected\': starsActivator[2] }\" ng-mouseover=starHover(2) ng-mouseleave=leave()>☆</span><span ng-class=\"{\'star-active\': stars >= 2.5, \'star-selected\': starsActivator[3] }\" ng-mouseover=starHover(3) ng-mouseleave=leave()>☆</span><span ng-class=\"{\'star-active\': stars >= 3.5, \'star-selected\': starsActivator[4] }\" ng-mouseover=starHover(4) ng-mouseleave=leave()>☆</span><span ng-class=\"{\'star-active\': stars >= 4.5, \'star-selected\': starsActivator[5] }\" ng-mouseover=starHover(5) ng-mouseleave=leave()>☆</span></span></span></p></div></div><div class=\"col-md-6 panel panel-default\" style=\"width: 250px\"><div class=panel-body><h3 style=\"margin-top: 0\" ng-show=isValidQuantity><span>Preis:&nbsp;</span><b>{{ price | number: 2 }}<span ng-show=isValidQuantity>€</span></b></h3><h4 style=\"margin-top: 0\" ng-show=!isValidQuantity ng-bind-html=price></h4><div class=input-group uib-tooltip=\"In den Warenkorb legen\" tooltip-placement=bottom style=\"width: 150px\"><span class=input-group-addon>Anzahl</span> <input type=text class=form-control ng-model=quantity ng-change=calcPrice()> <span class=input-group-btn><button class=\"btn btn-default\" type=button ng-click=toCart() ng-disabled=!isValidQuantity><span class=\"glyphicon glyphicon-shopping-cart\"></span></button></span></div></div></div></div><div class=row><div class=col-md-12 style=\"margin-top: 18px\"><ul class=\"nav nav-tabs\"><li role=presentation ng-class=\"{active: tab.active == \'description\'}\"><a ng-click=\"changeTab(\'description\')\">Beschreibung</a></li><li role=presentation ng-class=\"{active: tab.active == \'requirements\'}\"><a ng-click=\"changeTab(\'requirements\')\">Systemvorraussetzungen</a></li><li role=presentation ng-class=\"{active: tab.active == \'reviews\'}\"><a ng-click=\"changeTab(\'reviews\')\">Bewertungen</a></li></ul></div></div><div class=row><div ng-show=\"tab.active == \'description\'\" class=\"col-md-10 description\" id=description></div><div ng-show=\"tab.active == \'reviews\'\" class=\"col-md-10 description\"><div ng-repeat=\"review in actualGame.reviews | orderBy:\'date\':true\" class=review><p class=\"h4 rating-reviews\"><span class=rating><span>★</span><span ng-show=\"review.stars >= 1.5\">★</span><span ng-show=\"review.stars >= 2.5\">★</span><span ng-show=\"review.stars >= 3.5\">★</span><span ng-show=\"review.stars >= 4.5\">★</span></span> <span>☆☆☆☆☆</span> {{ review.title }}</p><p class=h5>Von: <b>{{ review.author }}</b> am {{ review.date | date:\'dd.MM.yyyy\'}}</p><p>{{ review.message }}</p><hr></div><div ng-if=\"actualGame.reviews.length == 0\"><span class=h4>Für dieses Spiel sind noch keine Rezensionen verfügbar!</span></div></div><div ng-show=\"tab.active == \'requirements\'\" class=\"col-md-10 description\"><p>Minimum RAM: {{ actualGame.minRam }}</p><p>Minimum Prozessor: {{ actualGame.minProcessor }}</p></div></div>");
$templateCache.put("app/cart/cart.html","<div ng-repeat=\"item in cart\" class=form-inline><input ng-model=item.quantity class=\"form-control input-sm form-control-inline\" style=\"width: 45px\" ng-change=quantityChange(item.id)> <span><a ui-sref=\"gameDetail({id: item.id})\">{{ item.name }}</a> (Stückpreis: {{ item.price }}€)</span> <span class=\"btn btn-default glyphicon glyphicon-trash\" style=\"margin-left: 10px\" ng-click=remove(item.id)></span><p><span class=h4 ng-show=item.quantity>{{ item.quantity * item.price | number: 2 }}€</span></p><hr></div><p class=h4 ng-show=totalPrice>Gesamt: {{ totalPrice | number: 2 }}€</p><button class=\"btn btn-default\" ng-show=totalPrice ui-sref=checkout>Zur Kasse gehen</button><p class=h4 ng-show=!totalPrice>Es sind keine Elemente im Warenkorb!</p>");
$templateCache.put("app/addArticle/addArticle.html","<div class=container><div class=row><div class=\"col-md-8 col-md-offset-2\"><h3>Neuen Artikel anlegen</h3><div class=form-group ng-class=\"{\'invalid\': !title && isTouched}\"><label for=title>Name:</label> <input type=text class=form-control id=title ng-model=title></div><div class=form-group ng-class=\"{\'invalid-select\': isTouched && ((!selected.genre && !isCustomGenre) || (isCustomGenre && !customGenre))}\"><label for=genre>Genre:</label><br><select class=form-control id=genre ng-model=selected.genre ng-disabled=isCustomGenre><option ng-repeat=\"genre in genres\">{{ genre }}</option></select><button class=\"btn btn-default\" ng-click=changeInputStyle() style=\"margin-top: 10px\">{{ genreButtonText }}</button><br><label for=newGenre style=\"margin-top: 10px\" ng-show=isCustomGenre>Neues Genre:</label> <input id=newGenre class=form-control ng-show=isCustomGenre ng-model=customGenre></div><button ng-click=test()>test</button><div class=form-group ng-class=\"{\'invalid\': (!price || isPriceInvalid) && isPriceTouched}\" uib-tooltip=\"Centbeträge mit Punkt trennen! (z.B. 12.99)\" tooltip-enable=isPriceInvalid><label for=price>Preis:</label> <input type=text class=form-control id=price ng-model=price ng-change=priceValidation()></div><div class=form-group><label for=fsk>Altersbeschränkung:</label><select class=form-control id=fsk ng-model=selected.fsk><option>0</option><option>6</option><option>12</option><option>16</option><option>18</option></select></div><div ng-class=\"{\'invalid\': !(selected.platform.wiiu || selected.platform.windows || selected.platform.ps || selected.platform.xbox || selected.platform.osx) && isTouched}\"><label>Plattformen</label><br><label class=checkbox-inline><input type=checkbox value=wiiu ng-model=selected.platform.wiiu>Wii U</label> <label class=checkbox-inline><input type=checkbox value=windows ng-model=selected.platform.windows>Windows</label> <label class=checkbox-inline><input type=checkbox value=ps ng-model=selected.platform.ps>PlayStation</label> <label class=checkbox-inline><input type=checkbox value=xbox ng-model=selected.platform.xbox>Xbox</label> <label class=checkbox-inline><input type=checkbox value=osx ng-model=selected.platform.osx>OS X</label></div><div class=form-group style=\"margin-top: 10px\" ng-class=\"{\'invalid\': !release && isTouched}\"><label for=release>Release:</label> <input type=text class=form-control id=release ng-model=release></div><div class=form-group ng-class=\"{\'invalid\': !language && isTouched}\"><label for=language>Sprache:</label> <input type=text class=form-control id=language ng-model=language></div><div class=form-group ng-class=\"{\'invalid\': !minRam && isTouched}\"><label for=minRam>Minimaler Arbeitsspeicher:</label> <input type=text class=form-control id=minRam ng-model=minRam></div><div class=form-group ng-class=\"{\'invalid\': !minProcessor && isTouched}\"><label for=minProcessor>Minimaler Prozessor:</label> <input type=text class=form-control id=minProcessor ng-model=minProcessor></div><div class=form-group ng-class=\"{\'invalid-textarea\': !description && isTouched}\"><label for=description>Beschreibung:</label><div text-angular ng-model=description id=description></div></div><img ng-src=\"{{ image }}\" imageonload ng-show=false><div class=\"fileinput fileinput-new\" data-provides=fileinput ng-class=\"{\'fileinput-invalid\': !image && isTouched}\"><span class=\"btn btn-default btn-file\"><span>Datei auswählen</span><input type=file ng-model=file onchange=angular.element(this).scope().imageToBase64(this)></span> <span class=fileinput-filename></span><span class=fileinput-new>Keine Datei ausgewählt</span></div><div class=form-group style=\"margin-top: 10px\"><button class=\"btn btn-success\" ng-click=addArticle()>Artikel anlegen</button></div></div></div></div>");
$templateCache.put("app/genre/genre.html","<div class=row><div class=col-md-3><h4>{{ genre }}</h4><input class=form-control placeholder=Suche ng-model=searchInput.name ng-show=isArticles></div></div><div class=col-md-12 style=\"margin-top: 20px;\"><div class=\"panel panel-default game-panels\" ng-repeat=\"article in articles | objectFilter: searchInput.name\"><div class=panel-heading><a class=h5 ui-sref=\"gameDetail({id: article.id})\">{{ article.name }} <span class=badge>{{ article.price }}€</span></a></div><div class=panel-body><a ui-sref=\"gameDetail({id: article.id})\"><img ng-src={{article.image}} class=panel-image></a></div></div></div><div class=col-md-12 ng-show=!isArticles>Für dieses Genre gibt es keine Spiele!</div>");
$templateCache.put("app/newGames/newGames.html","<p>This is the partial for view 2.</p>");
$templateCache.put("app/home/home.html","<div id=carousel-example-generic class=\"carousel slide slider\" data-ride=carousel><ol class=carousel-indicators><li data-target=#carousel-example-generic data-slide-to=0 class=active></li><li data-target=#carousel-example-generic data-slide-to=1></li></ol><div class=carousel-inner role=listbox><div class=\"item active\"><img src=assets/img/cod.jpg alt=\"Call Of Duty: Black Ops 2\" ui-sref=\"gameDetail({id: 1})\"><div class=carousel-caption>Call Of Duty: Black Ops 2</div></div><div class=item><img src=assets/img/fifa.jpg alt=\"FIFA 16\" ui-sref=\"gameDetail({id: 2})\"><div class=carousel-caption>FIFA 16</div></div></div><a class=\"left carousel-control\" href=#carousel-example-generic role=button data-slide=prev><span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=true></span> <span class=sr-only>Previous</span></a> <a class=\"right carousel-control\" href=#carousel-example-generic role=button data-slide=next><span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=true></span> <span class=sr-only>Next</span></a></div>");
$templateCache.put("app/login/login.html","<div class=container><div class=row><div class=\"col-md-6 col-md-offset-3\"><h4 style=\"border-bottom: 1px solid #c5c5c5;\"><i class=\"glyphicon glyphicon-user\"></i> Login</h4><div style=\"padding: 20px;\"><fieldset><div class=\"form-group input-group\" ng-class=\"{\'form-invalid\': !data.userName && isFormTouched}\"><span class=input-group-addon><i class=\"glyphicon glyphicon-user\"></i></span> <input class=form-control placeholder=Benutzername type=text ng-model=data.userName autofocus required id=username></div><div class=\"form-group input-group\" ng-class=\"{\'form-invalid\': !data.password && isFormTouched}\"><span class=input-group-addon><i class=\"glyphicon glyphicon-lock\"></i></span> <input class=form-control placeholder=Passwort type=password id=password ng-model=data.password required></div><div class=form-group><button class=\"btn btn-primary btn-block\" ng-click=login() id=submit>Anmelden</button><p class=help-block><a class=text-muted ui-sref=register><small>Registrieren</small></a> <a class=\"pull-right text-muted\" ui-sref=passwordForget><small>Passwort vergessen?</small></a></p></div></fieldset></div></div></div></div>");
$templateCache.put("app/orders/orders.html","<div ng-repeat=\"order in orders\"><p class=h4>Bestellung {{ order.id }} vom {{ order.date | date:\'dd.MM.yyyy\' }}</p><p class=h5>{{ order.price }}€</p><p>Bestellte Artikel:</p><div class=\"list-group col-md-3\"><div class=list-group-item ng-repeat=\"article in order.articles\">{{ article.quantity }}x <a ui-sref=\"gameDetail({id: article.id})\">{{ article.name }}</a><br>{{ article.quantity * article.price }}€</div></div></div>");
$templateCache.put("app/userAdministration/userAdministration.html","<table class=\"table table-condensed\"><thead><tr><th>Benutzer-ID</th><th>Rechte</th><th>Benutzername</th><th>Email</th><th>Aktionen</th></tr></thead><tbody><tr><td>1</td><td>Admin</td><td>daniel</td><td>daniel.s1mon@icloud.com</td><td><button class=\"btn btn-default glyphicon glyphicon-trash\"></button></td></tr></tbody></table>");
$templateCache.put("app/topGames/topGames.html","<p>This is the partial for view 1.</p>");
$templateCache.put("app/gameDetail/rating/rating.html","<div class=modal-header><h3 class=modal-title>Bewertung schreiben</h3></div><div class=modal-body><span class=rating><span>★</span><span ng-show=\"stars >= 1.5\">★</span><span ng-show=\"stars >= 2.5\">★</span><span ng-show=\"stars >= 3.5\">★</span><span ng-show=\"stars >= 4.5\">★</span></span> <span>☆☆☆☆☆</span><div class=form-group><label for=title>Titel:</label> <input type=text class=form-control id=title ng-model=title ng-change=checkValid()></div><div class=form-group><label for=message>Text:</label> <textarea class=form-control rows=5 id=message ng-model=message ng-change=checkValid()></textarea></div></div><div class=modal-footer><button class=\"btn btn-warning\" type=button ng-click=cancel()>Abbrechen</button> <button class=\"btn btn-primary\" type=button ng-click=submit() ng-disabled=!isValid>Abschicken</button></div>");
$templateCache.put("app/cart/checkout/checkout.html","<div ng-repeat=\"item in cart\"><p><b>{{ item.quantity }}</b>x {{ item.name }} (Stückpreis: {{ item.price }}€)</p><p><span class=h4 ng-show=item.quantity>{{ item.quantity * item.price | number: 2 }}€</span></p><hr></div><p class=h4 ng-show=totalPrice>Gesamt: {{ totalPrice | number: 2 }}€</p><button class=\"btn btn-warning\">Artikel bestellen</button>");
$templateCache.put("app/login/register/register.html","<div class=container><div class=row><div class=\"col-md-6 col-md-offset-3\"><h4 style=\"border-bottom: 1px solid #c5c5c5;\">Registrieren</h4><div style=\"padding: 20px;\"><fieldset><div class=\"form-group input-group\"><span class=input-group-addon><i class=\"glyphicon glyphicon-user\"></i></span> <input class=form-control placeholder=Benutzername type=text ng-model=data.userName autofocus required id=username></div><div class=\"form-group input-group\"><span class=input-group-addon>@</span> <input class=form-control placeholder=Email type=email ng-model=data.email autofocus required id=Email></div><div class=\"form-group input-group\"><span class=input-group-addon><i class=\"glyphicon glyphicon-lock\"></i></span> <input class=form-control placeholder=Passwort type=password id=password ng-model=data.password required></div><div class=\"form-group input-group\"><span class=input-group-addon><i class=\"glyphicon glyphicon-lock\"></i></span> <input class=form-control placeholder=\"Passwort bestätigen\" type=password id=passwordConfirm ng-model=data.passwordConfirm required></div><div class=form-group><button class=\"btn btn-primary btn-block\" ng-click=register() id=submit>Registrieren</button></div></fieldset></div></div></div></div>");
$templateCache.put("app/login/passwordForget/passwordForget.html","<div class=container><div class=row><div class=\"col-md-6 col-md-offset-3\"><h4 style=\"border-bottom: 1px solid #c5c5c5;\">Passwort vergessen</h4><div style=\"padding: 20px;\"><fieldset>Bitte geben Sie zum Zurücksetzen Ihres Passwortes die Email-Adresse ein.<br><br><div class=\"form-group input-group\"><span class=input-group-addon>@</span> <input class=form-control placeholder=Email type=email ng-model=data.email autofocus required id=email></div><div class=form-group><button class=\"btn btn-primary btn-block\" ng-click=submit() id=submit>Abschicken</button></div></fieldset></div></div></div></div>");}]);