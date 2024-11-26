const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch(
  'MN50QE3P0J',
  '8d693b34ba79a73c7d32314b93966108'
);

const search = instantsearch({
  indexName: 'ecommerceDemo',
  searchClient,
  future: { preserveSharedStateOnUnmount: true },
});

//Build a map to change display labels to make it look nicer. Used in currentRefinements
const FILTER_LABEL_MAP ={
  "hierarchicalCategories.lvl0": "Categories"
};

// Adding Search Box (text-based query) and Hits Widgets to allow search and show results
search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components }) => html`
        <article>
          <img src=${hit.image} alt=${hit.name} />
          <div>
            <h1>${components.Highlight({ hit, attribute: 'name' })}</h1>
            <p>${components.Highlight({ hit, attribute: "description"})}</p>
          </div>
        </article>
      `,
    },
  }),

  //Apply raw search parameters without rendering. Search results per page
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),

  //Displays pagination system on the bottom to change current page of results
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),

  //Allows filtering the dataset based on facets. In this case brand
  instantsearch.widgets.refinementList({
    container: "#refinement-list",
    attribute:"brand",
  }),

  //Displays a list of refinements applied to search
  instantsearch.widgets.currentRefinements({
    container: "#current-refinements",

    //Transform hierarchial attributes to display based on Label Map above
    transformItems(items) {
      return items.map((item) => ({
        ...item,
        label: FILTER_LABEL_MAP[item.label] || item.label,
      }));
    }
  }),
  
  //Displays a button that lets users clear every refinement applied
  instantsearch.widgets.clearRefinements({
    container: "#clear-refinements"
  }),

  //Create navigation menu based on a hierarchy of facet attributes - categories/subcategories
  instantsearch.widgets.hierarchicalMenu({
    container: '#hierarchical-menu',
    attributes: [
      'hierarchicalCategories.lvl0',
      'hierarchicalCategories.lvl1',
      'hierarchicalCategories.lvl2',
      'hierarchicalCategories.lvl3',
    ],
  }),

  //Adding sorting widget based on different relevant sort indicies
  instantsearch.widgets.sortBy({
    container: "#sortby",
    items: [
      {
        label: "Sort by relevance",
        value: 'ecommerceDemo',
      },
      {
        label: "Sort by rating",
        value: 'ecommerceDemo-pop',
      },
      {
        label: "Sort by alphabetical",
        value: 'ecommerceDemo-alpha', 
      }
    ],
  })
]);

search.start();
