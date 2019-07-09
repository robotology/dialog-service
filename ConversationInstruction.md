# How to create a dialog flow exploting IBM cloud services

* Login to the [Dashboard](https://cloud.ibm.com/resources)
* Search from the [Catalogue](https://cloud.ibm.com/catalog) the service you would like to use. In this case we need [Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant).
* Create the service and 
* Need help? Have a look into the [API documents](https://cloud.ibm.com/apidocs/assistant)

## Dialogue flow

The dialogue is made up of nodes of the conversation, intents and entities. 

* <b>nodes: </b> Each node represents a particular part of the conversation you would like to have, hence a specific branch of the dialogue. 
There are two possible nodes to create: adding node above/below or adding child nodes to the current one. 
The added child nodes construct the conversation of the branch related to node. 

* <b>intents: </b> Intents are ways to trigger a specific node of the conversation (i.e each intent is composed of possible way to ask for something). 
* <b>entities: </b> Entities represent objects, meanings, people. Each entity must be filled with all different posibilities of that entity. 
