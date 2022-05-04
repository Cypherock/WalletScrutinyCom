// The following can be run as a bookmarklet while at https://play.google.com/store/search?q=bitcoin wallet&c=apps
// First get a list of all applicationIds:
// ls -1 _android/ | tr -s '\n' ' ' | sed 's/.md /","/g'
// update the line below accordingly:
const apps = ["africa.bitkoin.buycoins","africa.bundle.mobile.app","ai.azara.wallet","app.flitsnode.flits","app.getvega","app.goodcrypto","app.hibana.hibana","appinventor.ai_oldgoldmen.CryptoWallet","app.odapplications.bitstashwallet","app.zeusln.zeus","ar.com.andinasmart.defiant","asia.coins.mobile","at.bitpocket.pos","best.bitcoin.wallet.btc.price.buy.cryptocurrency","binance.cryptowalletapp","bitcoin.twenty.twenty","bitmesh.volt.wallet","btcmine.btcwallet","btc.org.freewallet.app","capital.spatium.wallet","casa.keymaster","cash.klever.blockchain.wallet","ch.shiftcrypto.bitboxapp","cloud.peer2.pungo_wallet","co.asachs.bitbuddy","co.bacoor.keyring","co.bitx.android.wallet","cobo.wallet","co.busha.android","co.decrypt.app","co.edgesecure.app","co.hodlwallet","co.hold.mobile","co.id.dompet.btc.indonesia","coin98.crypto.finance.media","coinsquare.io.coinsquare","com.adenter.mercurycash","com.aegiswallet","com.airbitz","com.algorand.android","com.allcoinwallet.allcoinwallet","com.alpha.wallet","com.altcoinfantasy.altcoinfantasy","com.andreys.blockchainwallet","com.Android.Inc.bitwallet","com.androidwallet","com.aniket.my_paper_wallet","com.ankerpay.wallet","com.anxbtc.android","com.app.cryptofully","com.application.bitcoiva","com.arzjoo","com.atlas.mobile.wallet","com.atomex.android","com.authentrend.atwallet","com.b4uwallet.android","com.badgermobile","com.balletcrypto","com.bankofhodlers.mobile","com.bcoiner.webviewapp","com.beeone.techbank","com.binance.dev","com.binance.us","com.bitalgopayment.android","com.bitbill.www","com.bit.btcwallet","com.bitcoinexchangehani.buybitcoin","com.bitcoin.firstdigitalhub","com.bitcoininc.bitcoinpay","com.bitcoinindia.Btciapp","com.bitcoin.merchant.app","com.bitcoin.mwallet","com.bitcoinofamerica.wallet","com.bitcoin.wallet.btc","com.BitcoinWalletExchange.org","com.bitholic.rdmchain.bitholic","com.bitkeep.wallet","com.bitlish.bitlish","com.bitmart.bitmarket","com.bitnovo.app","com.bitorzo.wallet","com.bitpapa","com.bitpay.coincloud","com.bitpay.wallet","com.bitpie","com.Bitplaza.android","com.bitrefill.app","com.bitrue.currency.exchange","com.bitshield.bitshieldwallet","com.bitso.wallet","com.bittrex.trade","com.bitzhash.wallet.bitcoin","com.blixtwallet","com.blockabc.abcwallet","com.blockchain.android","com.blockchainpluswallet.plus_wallet_app","com.blockchainproplus.bpw","com.blockfolio.blockfolio","com.blocktrail.mywallet","com.bokucoin.app","com.bolt.pegasus","com.boquanhash.dotwallet","com.breadwallet","com.breez.client","com.brentpanther.bitcoinwidget","com.btckorea.bithumba","com.btckorea.bithumb","com.buda.crypto","com.buysellhodl","com.buyucoinApp.buyucoin","com.bybit.app","com.cakewallet.cake_wallet","com.cashuwallet.android","com.ccwalletapp","com.chameleon.wallet","com.changelly.app","com.chippercash","com.cmcm.blockchain.bitcoin.ethereum.safewallet","com.cobinhood.exchange","com.coinapps.flash.wallet.android","com.coinbase.android","com.coinbase.pro","com.coinbase.wallite","com.coindeal","com.coinex.trade.play","com.coinfalcon.mobile","com.coingate.pos","com.coinhako","com.coinninja.coinkeeper","com.coinomi.wallet","com.coinorbis.wallet","com.coinpay","com.coinspace.app","com.conio.wallet","com.coolbitx.cwsapp","com.counos","com.crypterium","com.cryptocurrencys.bestwallet","com.crypto.multiwallet","com.cryptonator.android","com.cryptopay","com.currency.exchange.prod2","com.cybavo.btc.wallet","com.czprime","com.dcash.wallet","com.defi.wallet","com.digifinex.app","com.dok.wallet","com.dowallet","com.ebcecosystem.wallets","com.electroneum.mobile","com.eletac.tronwallet","com.ellipal.wallet","com.enjin.mobile.wallet","com.etoro.openbook","com.etoro.wallet","com.evercoin","com.exchangily.wallet","com.exmo","com.exscudo.channels","com.ezdefi","com.factwallet.crypto.factwallet","com.fitbobcat.satoshi","com.flare","com.flutter.litebit","com.fluxpayment","com.freaks.app.handcash","com.ftxmobile.ftx","com.galoyapp","com.gemini.android.app","com.getchange.wallet.cordova","com.gloath.portalsapp","com.greenaddress.abcore","com.greenaddress.greenbits_android_wallet","com.hconline.iso","com.hebeblock.hebewallet","com.hittechsexpertlimited.hitbtc","com.holytransaction","com.hotbtc.exchange","com.huobionchainwallet.gp","com.incognito.wallet","com.instantcoins","com.investvoyager","com.iqfinex","com.ixx_android","com.jurajkusnier.bitcoinwalletbalance","com.kesemwalletapp","com.kisswallet","com.koinal.android","com.krakenfutures","com.kraken.trade","com.kr.iotrust.dcent.wallet","com.krypto","com.kubi.kucoin","com.kurewallet","com.kyberswap.android","com.leadwallet.io","com.ledger.live","com.legendwd.hyperpayW","com.liberty.jaxx","com.lightning.denryu","com.lightning.walletapp","com.lingxi.bexplus","com.livingroomofsatoshi.wallet","com.lumiwallet.android","com.luneswallet","com.lykkex.LykkeWallet","com.m2049r.xmrwallet","com.magnum.wallet","com.maxonrow.wallet","com.maxxwallet","com.medishares.android","com.mercuryo.app","com.mfcoin.wallet.dev","com.microbitcoin","com.midasprotocol.wallet.android","com.mk.cryptofolio","com.mobileln","com.monederoapp","com.moonlet","com.mtpelerin.bridge","com.murextrivium.walletapp","com.mycelium.wallet","com.myetherwallet.mewwallet","com.mykey.id","com.neobitcoin.wallet","com.newgo.coincola","com.nexowallet","com.node.coindirect","com.okinc.okex.gp","co.mona.android","com.onebit.app","com.ownrwallet.wallet","com.paperwallet.top","com.paxful.wallet","com.paymintlabs.paymint","com.paytomat","com.paywaywallet","com.phemex.app","com.phonegap.bit2me","com.pillarproject.wallet","com.plunien.poloniex","com.plusbit","com.plutus.wallet","com.pointpay.bank","com.polehin.android","com.polispay.copay","com.prizmbit","com.probit.app.android2.release.global","com.pro.bitcointoyou","com.ptpwallet","com.pumapay.pumawallet","com.qcan.mobile.bitcoin.wallet","com.QuickX","com.quicrypto","com.quidax.app","com.quppy","com.remitano.remitano","com.ripio.android","com.roqqu.app","com.rsk.rwallet.reactnative","com.samourai.sentinel","com.samourai.wallet","com.SatoshiTango.SatoshiTango","com.satsapp","com.secrypto","com.sf.monarch","com.shaketh","com.shango","com.shapeshift.droid_shapeshift","com.silenca.amlsafe","com.sixpencer.simplework","com.sologenicwallet","com.sparkpoint","com.spark.wallet","com.spend.app","com.spot.spot","com.squareup.cash","com.stasis.stasiswallet","com.stormgain.mobile","com.swapwalletltd.swap","com.swftcoin.client.android","com.swipe.wallet","com.tabtrader.android","com.tangem.wallet","com.thinkdevs.cryptomarket","com.tronwallet2","com.trusteewallet","com.unocoin.unocoinwallet","com.uphold.wallet","com.uwalletapp","com.valr.app","com.vegawallet.in","com.viabtc.wallet","com.vidulumwallet.app","com.visionwallet.app","com.wallet.crypto.trustapp","com.wasabiwallet.dev","com.wrx.wazirx","com.xapo","com.XcelTrip.XcelPay","com.xcoex.mobile","com.xzen.wallet","com.yes.yeswallet","com.youhodler.youhodler","com.zedXeWallet","com.zelcash.zelcore","com.zengo.wallet","com.zumopay.core","co.nayuta.wallet","co.okex.app","co.satoshiwallet.app","co.za.binarymatter.bitcoinwalletfake","cryptoex.elegro.io","de.fuf.bitbucks","de.schildbach.wallet","engineering.lightning.LightningMainnet","eu.crystalwallet.app","exodusmovement.exodus","fr.acinq.eclair.wallet.mainnet2","fr.acinq.phoenix.mainnet","gbbit.app.wallet","ilcbtc.wallet","im.token.app99","im.token.app","info.mysecurewallet.wallet","io.atomicwallet","io.bitmax.exchange","io.bluewallet.bluewallet","io.cex.app.prod","io.changenow.changenow","io.crypto.wallet.bitcoin.ethereum.medooza.wallet","io.dharma.Dharma","io.ducatus.walnew","io.eidoo.wallet.prodnet","io.ethos.universalwallet","io.freewallet.mobile","io.getdelta.android","io.goldwallet.wallet","io.handcash.wallet","io.hexawallet.hexa","io.horizontalsystems.bankwallet","io.infinito.wallet","io.melis.clientwallet","io.melis.walletlite","io.metamask","io.muun.apollo","io.nash.app","io.ob1.nativeandroid","io.safepal.wallet","io.smcc.sccwallet","io.sylo.dapp","io.talken.wallet","io.totalcoin.wallet","io.wallet","io.yellowcard.app","io.zebedee.wallet","it.airgap.vault","it.airgap.wallet","it.inbitcoin.altana","jb.tech.bitpiewallet","jb.tech.blockchainpro","kr.co.keypair.afintouch","kr.co.keypair.keywalletTouch","kr.co.keypair.nextouch","kr.co.keypair.nixtouch","kr.co.keypair.purplecardtouch","kr.co.keypair.quickxtouch","loadng.com.loadng","lt.spectrofinance.spectrocoin.android.wallet","me.coinpal.app","me.cryptopay.android","mw.org.freewallet.app","net.bitbay.bitcoin","net.bither","net.bitstamp.app","net.coinpayments.coinpaymentsapp","network.celsius.wallet","ng.wallet.app","org.bitcoinox.bitcoinoxwallet","org.bitcoin.wallet","org.capricoin.copay","org.coinid.vault","org.coinid.wallet.btc","org.electroncash.wallet","org.electrum.electrum99","org.electrum.electrum","org.freewallet.lite.android","org.lndroid.bitcoincore","org.secuso.privacyfriendlyopiuycemanoper","org.topnetwork.hiwallet","org.toshi","org.zupago.pe","partl.coini","paydeepp.elegro.io","piuk.blockchain.android","pro.bingbon.app","pro.bitapp.android","pro.huobi","pt.ipleiria.estg.dei.yabw","ru.koshelek","ru.valle.btc","tech.hodler.core","tech.insense.sensewalet","vip.mytokenpocket","wallet.gem.com.atoken","xyz.must.wallet","zapsolutions.strike","zapsolutions.zap","zebpay.Application"];apps.forEach(app=>{document.querySelectorAll(`a[href='/store/apps/details?id=${app}']`).forEach((it) => {it.style.backgroundColor="#0f04"})})
