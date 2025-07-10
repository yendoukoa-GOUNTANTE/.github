import UIKit
import WebKit // Don't forget to import WebKit

class ConceptualViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {

    var webView: WKWebView!
    // Replace this with the actual URL of your PWA
    let pwaURLString = "https://YOUR_PWA_HOSTED_URL_HERE"

    override func loadView() {
        super.loadView() // Call super

        let webConfiguration = WKWebViewConfiguration()

        // Example: Allow JavaScript to interact with Swift via message handlers
        // let contentController = WKUserContentController()
        // contentController.add(self, name: "myNativeFeature") // 'self' must conform to WKScriptMessageHandler
        // webConfiguration.userContentController = contentController

        // Example: Injecting a JavaScript file
        // let userScript = WKUserScript(source: "console.log('Injected script!');", injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        // webConfiguration.userContentController.addUserScript(userScript)

        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = self
        webView.uiDelegate = self // Needed for things like JavaScript alerts, confirms, prompts

        // Allow back/forward swipe gestures
        webView.allowsBackForwardNavigationGestures = true

        self.view = webView // Set the webView as the main view of this controller
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        guard let pwaURL = URL(string: pwaURLString) else {
            print("Error: Invalid PWA URL string: \(pwaURLString)")
            // Optionally, display an error message to the user in the UI
            let errorLabel = UILabel()
            errorLabel.text = "Error: Could not load PWA. Invalid URL."
            errorLabel.textAlignment = .center
            errorLabel.frame = self.view.bounds
            self.view.addSubview(errorLabel) // Add to the main view, not webView
            return
        }

        if pwaURLString == "YOUR_PWA_HOSTED_URL_HERE" {
            print("WARNING: PWA URL is not configured in ConceptualViewController.swift")
            let alertLabel = UILabel()
            alertLabel.text = "Please configure the PWA URL in ConceptualViewController.swift"
            alertLabel.textAlignment = .center
            alertLabel.numberOfLines = 0
            alertLabel.frame = self.view.bounds
            self.view.addSubview(alertLabel)
            // Consider not loading if the URL is the placeholder
            return
        }

        let request = URLRequest(url: pwaURL)
        webView.load(request)

        // Optional: Add a refresh control
        let refreshControl = UIRefreshControl()
        refreshControl.addTarget(self, action: #selector(refreshWebView(_:)), for: .valueChanged)
        webView.scrollView.addSubview(refreshControl)
        webView.scrollView.bounces = true // Ensure scrolling is enabled for refresh control
    }

    @objc func refreshWebView(_ sender: UIRefreshControl) {
        webView.reload()
        sender.endRefreshing()
    }

    // MARK: - WKNavigationDelegate Methods

    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("Webview didStartProvisionalNavigation")
        // Show a loading indicator if you have one
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("Webview didFinish navigation")
        // Hide loading indicator
        // You can also get the page title:
        // self.title = webView.title
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("Webview didFail navigation with error: \(error.localizedDescription)")
        // Hide loading indicator and show an error message
        // You could load a local HTML error page:
        // let htmlErrorPath = Bundle.main.path(forResource: "error", ofType: "html")
        // let htmlErrorUrl = URL(fileURLWithPath: htmlErrorPath!)
        // webView.loadFileURL(htmlErrorUrl, allowingReadAccessTo: htmlErrorUrl)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        print("Webview didFailProvisionalNavigation with error: \(error.localizedDescription)")
        // Hide loading indicator and show an error message, e.g., for "No Internet Connection"
    }

    // MARK: - WKUIDelegate Methods (optional, for JS alerts, confirms, prompts)

    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alertController = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in completionHandler() }))
        present(alertController, animated: true, completion: nil)
    }

    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alertController = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in completionHandler(true) }))
        alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { _ in completionHandler(false) }))
        present(alertController, animated: true, completion: nil)
    }

    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        let alertController = UIAlertController(title: nil, message: prompt, preferredStyle: .alert)
        alertController.addTextField { textField in
            textField.text = defaultText
        }
        alertController.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
            if let text = alertController.textFields?.first?.text {
                completionHandler(text)
            } else {
                completionHandler(defaultText)
            }
        }))
        alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { _ in completionHandler(nil) }))
        present(alertController, animated: true, completion: nil)
    }
}

// MARK: - WKScriptMessageHandler (Example, if you added a message handler)
/*
extension ConceptualViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "myNativeFeature" {
            print("JavaScript is sending a message: \(message.body)")
            // Process the message body and perform native actions
            // Example: webView.evaluateJavaScript("alert('Native code received your message!');", completionHandler: nil)
        }
    }
}
*/
