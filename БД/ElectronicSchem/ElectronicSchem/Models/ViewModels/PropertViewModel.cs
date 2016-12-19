using System.Collections.Generic;
using ElectronicSchem.Models.ElectronicSchemModels.Components;
using System.Linq;

namespace ElectronicSchem.Models.ViewModels
{
    public class PropertyViewModel
    {
        public string type { get; set; }

        public string key { get; set; }

        public string value { get; set; }

        public string defaultValue { get; set; }

        public double maxValue { get; set; }

        public double minValue { get; set; }

        public int maxLength { get; set; }

        public int minLength { get; set; }

        public virtual ICollection<PropertyItemsViewModel> items { get; set; }

        public PropertyViewModel(PropertyModel property)
        {
            type = property.Type;
            key = property.Key;
            defaultValue = property.DefaultValue;
            maxValue = property.MaxValue;
            minValue = property.MinValue;
            maxLength = property.MaxLength;
            minLength = property.MinLength;
            value = property.Value;

            items = new List<PropertyItemsViewModel>();

            for (int i = 0; i < property.Items.Count; i++)
                items.Add(new PropertyItemsViewModel(property.Items.ElementAt(i)));
        }
    }
}