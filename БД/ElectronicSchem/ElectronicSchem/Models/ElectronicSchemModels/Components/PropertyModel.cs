using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectronicSchem.Models.ElectronicSchemModels.Components
{
    public class PropertyModel
    {
        [Key]
        public long ID { get; set; }

        public string Type { get; set; }

        public string Key { get; set; }

        public string Value { get; set; }

        public string DefaultValue { get; set; }

        public double MaxValue { get; set; }

        public double MinValue { get; set; }

        public int MaxLength { get; set; }

        public int MinLength { get; set; }

        public virtual ICollection<PropertyItemsModel> Items { get; set; }

        public virtual ComponentModel Component { get; set; }
    }
}