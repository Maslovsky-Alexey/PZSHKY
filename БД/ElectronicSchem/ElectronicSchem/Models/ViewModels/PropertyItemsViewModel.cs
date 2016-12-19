using ElectronicSchem.Models.ElectronicSchemModels.Components;


namespace ElectronicSchem.Models.ViewModels
{
    public class PropertyItemsViewModel
    {
        public string value { get; set; }

        public PropertyItemsViewModel(PropertyItemsModel propertyItem)
        {
            value = propertyItem.Value;
        }
    }
}